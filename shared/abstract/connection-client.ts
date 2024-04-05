export abstract class ConnectionClient<T> {
	isConnected: boolean = false
	client?: T
	protected timeout: number
	protected serviceName: string

	constructor(serviceName: string, timeout: number = 5000) {
		this.timeout = timeout
		this.serviceName = serviceName
	}

	async connect() {
		throw new Error('Method not implemented.')
	}

	protected async connectWithRetry(connection: () => Promise<T>) {
		try {
			this.client = await connection()
			this.isConnected = true
			console.log(`Connected to ${this.serviceName}`)
		} catch (error) {
			console.log(
				`Failed to connect to ${this.serviceName}, retrying in ${
					this.timeout / 1000
				}s...`
			)
			await new Promise((resolve) => setTimeout(resolve, this.timeout))
			await this.connectWithRetry(connection)
		}
	}
}
