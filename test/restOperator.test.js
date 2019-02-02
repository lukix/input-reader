const reader = require('../src/index')

describe('Rest operator', () => {
	test('Normal + rest', () => {
		const data = `
			1 2 3 4 5
		`
		const pattern = `
			first ...rest
		`
		const result = reader(data, pattern)
	
		const expectedResult = { first: 1, rest: [2, 3, 4, 5] }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Only rest', () => {
		const data = `
			1 2 3 4 5
		`
		const pattern = `
			...rest
		`
		const result = reader(data, pattern)
	
		const expectedResult = { rest: [1, 2, 3, 4, 5] }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Empty rest', () => {
		const data = `
			1 2
		`
		const pattern = `
			a b ...rest
		`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 1, b: 2, rest: [] }
		expect(result).toStrictEqual(expectedResult)
	})
})
