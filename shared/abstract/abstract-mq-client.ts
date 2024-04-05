import amqlib from 'amqplib'
import { ConnectionClient } from './connection-client'

export abstract class AbstractMessageQueueClient extends ConnectionClient<amqlib.Connection> {

	constructor() {
		super('RabbitMQ', 10000)
	}

	objectToBuffer(obj: object) {
		return Buffer.from(JSON.stringify(obj))
	}

	bufferToObject<T>(buffer: Buffer) {
		return JSON.parse(buffer.toString()) as T
	}
}
