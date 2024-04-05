import mongoose from 'mongoose'
import { OrderStatus } from '../../../shared/models/order-status'

const orderSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	status: {
		type: Number,
		enum: OrderStatus,
		default: OrderStatus.received,
		required: true,
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now,
	},
})

export const Order = mongoose.model('Order', orderSchema)
