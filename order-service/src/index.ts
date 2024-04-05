import mongoose from 'mongoose'
import { Order } from './models/order'
import {
	OrderMessage,
	UpdateStatusMessage,
} from '../../shared/messages/mq-messages'
import { OrderStatus } from '../../shared/models/order-status'
import { MessageQueueClient } from '../../shared/mq-client'

const mqClient = new MessageQueueClient()
await mqClient.connect()

const channel = await mqClient.createSingleChannel<OrderMessage>(
	Bun.env.CH_ORDER!
)
const updateChannel = await mqClient.createSingleChannel<UpdateStatusMessage>(
	Bun.env.CH_UPDATE!
)

mongoose.connect(Bun.env.MONGO_URL! + '/order-service')

channel.consume(async (msg) => {
	await Order.create({ id: msg.id })
	setTimeout(() => {
		updateChannel.sendToQueue({
			id: msg.id,
			status: OrderStatus.processing,
		})
	}, 5000)

	setTimeout(() => {
		updateChannel.sendToQueue({ id: msg.id, status: OrderStatus.sent })
	}, 10000)
})

