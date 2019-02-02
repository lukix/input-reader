const reader = require('../src/index')

describe('Multiline rest operator', () => {
	test('Normal + rest', () => {
		const data = `
			1 2
			3 4
			5 6
		`
		const pattern = `
			a b
			...lines[a b]
		`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 1, b: 2, lines: [{ a: 3, b: 4 }, { a: 5, b: 6 }] }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Only multiline rest', () => {
		const data = `
			1 2
			3 4
			5 6
		`
		const pattern = `
			...lines[a b]
		`
		const result = reader(data, pattern)
	
		const expectedResult = { lines: [{ a: 1, b: 2 }, { a: 3, b: 4 }, { a: 5, b: 6 }] }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Nested rest operators', () => {
		const data = `
			1 2 3
			4 5 6
		`
		const pattern = `
			...lines[...values]
		`
		const result = reader(data, pattern)
	
		const expectedResult = { lines: [{ values: [1, 2, 3] }, { values: [4, 5, 6] }] }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Empty rest', () => {
		const data = `
			1 2
			3 4
		`
		const pattern = `
			a b
			c d
			...lines[...values]
		`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 1, b: 2, c: 3, d: 4, lines: [] }
		expect(result).toStrictEqual(expectedResult)
	})
})
