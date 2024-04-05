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

mongoose.connect(Bun.env.MONGO_URL! + '/return-service')

const channel = await mqClient.createSingleChannel<OrderMessage>(
	Bun.env.CH_RETURN!
)
const updateChannel = await mqClient.createSingleChannel<UpdateStatusMessage>(
	Bun.env.CH_UPDATE!
)

channel.consume(async (msg) => {
	await Order.create({ id: msg.id })
	setTimeout(() => {
		updateChannel.sendToQueue({ id: msg.id, status: OrderStatus.returned })
	}, 10000)
})
