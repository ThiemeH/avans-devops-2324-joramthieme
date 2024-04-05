import amqlib from 'amqplib'
import { MessageQueueClient } from '../mq-client'

export class MQSingleChannel<T> {
	private client: MessageQueueClient
	private channel: amqlib.Channel
	private channelName: string

	constructor(
		client: MessageQueueClient,
		channel: amqlib.Channel,
		channelName: string
	) {
		this.client = client
		this.channel = channel
		this.channelName = channelName
	}

	sendToQueue(obj: object) {
		try {
			const message = this.client.objectToBuffer(obj)
			this.channel?.sendToQueue(this.channelName, message)
		} catch (error) {
			console.log(error)
		}
	}

	consume(callback: (msg: T) => void) {
		this.channel?.consume(this.channelName, (msg) => {
			if (msg) {
				this.channel.ack(msg)
				callback(this.client.bufferToObject(msg.content))
			}
		})
	}
}
