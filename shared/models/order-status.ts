export enum OrderStatus {
	'received' = 0,
	'processing',
	'sent',
	'requested_return',
	'returned',
}

export function getOrderStatus(status: OrderStatus): string {
	switch (status) {
		case OrderStatus.received:
			return 'Received'
		case OrderStatus.processing:
			return 'Processing'
		case OrderStatus.sent:
			return 'Sent'
		case OrderStatus.requested_return:
			return 'Requested Return'
		case OrderStatus.returned:
			return 'Returned'
		default:
			return 'Unknown'
	}
}
