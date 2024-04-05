import { OrderStatus } from '../models/order-status'

export interface UpdateStatusMessage {
	id: string
	status: OrderStatus
}

export interface OrderMessage {
	id: string
}
