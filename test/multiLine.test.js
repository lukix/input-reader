const reader = require('../src/index')

describe('Multi-line mapping', () => {
	test('Standard case', () => {
		const data = `
			5 7
			1 2 3
		`
		const pattern = `
			a b
			c d e
		`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 5, b: 7, c: 1, d: 2, e: 3 }
		expect(result).toStrictEqual(expectedResult)
	})

	test('More data then pattern specifies', () => {
		const data = `
			5 7
			1 2 3
			8 9 9
			0 0
		`
		const pattern = `
			a b
			c d e
		`
		const result = reader(data, pattern)

		const expectedResult = { a: 5, b: 7, c: 1, d: 2, e: 3 }
		expect(result).toStrictEqual(expectedResult)
	})
})
