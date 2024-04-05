import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
})

export const Order = mongoose.model('Order', orderSchema)
