export const ValidationHelper = {
	isValidString(input: any): boolean {
		return (
			input !== undefined && typeof input === 'string' && input.length > 0
		)
	},
}
