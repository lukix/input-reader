const reader = require('../src/index')

describe('Single-line mapping', () => {
	test('Standard case', () => {
		const data = `5 7`
		const pattern = `a b`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 5, b: 7 }
		expect(result).toStrictEqual(expectedResult)
	})

	test('More data then pattern specifies', () => {
		const data = `5 7 3`
		const pattern = `a b`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 5, b: 7 }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Less data then pattern specifies', () => {
		const data = `5 7`
		const pattern = `a b c`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 5, b: 7 }
		expect(result).toStrictEqual(expectedResult)
	})

	test('Whitespaces other than spaces', () => {
		const data = ` 5 7   test  `
		const pattern = ` a  b c`
		const result = reader(data, pattern)
	
		const expectedResult = { a: 5, b: 7, c: 'test' }
		expect(result).toStrictEqual(expectedResult)
	})
})
