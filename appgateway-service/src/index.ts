import crypto from 'crypto'
import express from 'express'
import promMid from 'express-prometheus-middleware'
import mongoose from 'mongoose'
import { ValidationHelper } from './helpers/validation-helper'
import { Order } from './models/order'
import {
	OrderMessage,
	UpdateStatusMessage,
} from '../../shared/messages/mq-messages'
import { OrderStatus, getOrderStatus } from '../../shared/models/order-status'
import { MessageQueueClient } from '../../shared/mq-client'

async function run() {
	await mongoose.connect(process.env.MONGO_URL! + '/appgateway-service')

	const mqClient = new MessageQueueClient()
	await mqClient.connect()
	const orderChannel = await mqClient.createSingleChannel<OrderMessage>(
		process.env.CH_ORDER!
	)
	const returnChannel = await mqClient.createSingleChannel<OrderMessage>(
		process.env.CH_RETURN!
	)
	const updateChannel =
		await mqClient.createSingleChannel<UpdateStatusMessage>(
			process.env.CH_UPDATE!
		)

	const app = express()

	app.get('/orders', async (req, res) => {
		const orders = await Order.find()
			.select('id name status -_id')
			.sort('-created_at')
		const ordersFormatted = orders.map((order) => {
			return {
				id: order.id,
				name: order.name,
				status: getOrderStatus(order.status),
			}
		})
		res.json(ordersFormatted)
	})

	app.post('/orders/create', async (req, res) => {
		const name = req.query.name
		if (!ValidationHelper.isValidString(name)) {
			return res.status(400).send('Name is required')
		}
		const order = await Order.create({ name, id: crypto.randomUUID() })
		orderChannel.sendToQueue({ id: order.id })
		res.send(`Order created. Id: ${order.id}`)
	})

	app.put('/orders/return', async (req, res) => {
		const id = req.query.id
		if (!ValidationHelper.isValidString(id)) {
			return res.status(400).send('Id is required')
		}
		await Order.findOneAndUpdate(
			{ id },
			{ status: OrderStatus.requested_return }
		)
		returnChannel.sendToQueue({ id: id })
		res.send(`Order return requested. Id: ${id}`)
	})

	app.delete('/orders/delete/all', async (req, res) => {
		await Order.deleteMany({})
		res.send('All orders deleted')
	})

	updateChannel.consume(async (msg) => {
		const { id, status } = msg
		await Order.findOneAndUpdate(
			{ id },
			{
				status,
			}
		)
	})

	const PORT = 3005

	app.use(
		promMid({
			metricsPath: '/metrics',
			collectDefaultMetrics: true,
			requestDurationBuckets: [0.1, 0.5, 1, 1.5],
			requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
			responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
		})
	)

	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`)
	})
}

run()

