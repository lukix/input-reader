const LINE_TYPE = 'LINE_TYPE'
const EMPTY_LINE_TYPE = 'EMPTY_LINE_TYPE'
const LINES_ARRAY_TYPE = 'LINES_ARRAY_TYPE'
const ERROR_TYPE = 'ERROR_TYPE'
const SYMBOL_TYPE = 'SYMBOL_TYPE'
const SYMBOLS_ARRAY_TYPE = 'SYMBOLS_ARRAY_TYPE'
const errorMessages = {
	LAST_ELEMENT: `'...' operator can be only used as the last symbol of the line`,
	ONLY_ELEMENT: `'...[]' operator must be the only element in the line`,
	INVALID_ARRAY_NAME: `Invalid array name`,
}
const whitespaceRegex = /[ ,]+/

function parseToSyntaxStructure(pattern) {
	const patternLines = pattern.split('\n').map(line => line.trim())
	return patternLines.map(parseLine)
}
function parseLine(patternLine) {
	return patternLine.substr(0, 3) === '...' && patternLine.indexOf('[') > -1 //Check for '...[]' operator
		? parseLinesArray(patternLine)
		: parseSingleLine(patternLine)
}
function parseLinesArray(patternLine) {
	const arrayName = patternLine.substr(3).split('[')[0]
	if(!isValidPropName(arrayName)) {
		return { type: ERROR_TYPE, name: errorMessages.INVALID_ARRAY_NAME }
	}
	const afterArrayStr = patternLine.split(']')[1]
	return whitespaceRegex.test(arrayName) || whitespaceRegex.test(afterArrayStr)
		? { type: ERROR_TYPE, name: errorMessages.ONLY_ELEMENT }
		: {
			type: LINES_ARRAY_TYPE,
			name: arrayName,
			innerPattern: parseSingleLine(patternLine.substring(
				patternLine.indexOf("[") + 1,
				patternLine.indexOf("]"),
			))
		}
}
function parseSingleLine(patternLine) {
	if (patternLine === '') {
		return { type: EMPTY_LINE_TYPE }
	}

	const symbols = patternLine.split(whitespaceRegex)
	const symbolObjects = symbols.map((symbol) => (
		symbol.substr(0, 3) === '...'
			? !isValidPropName(symbol.substr(3))
				? { type: ERROR_TYPE, name: errorMessages.INVALID_ARRAY_NAME }
				: { type: SYMBOLS_ARRAY_TYPE, name: symbol.substr(3) }
			: { type: SYMBOL_TYPE, name: symbol }
	))
	const validatedSymbolObjects = symbolObjects.map((symbol, index, array) => (
		symbol.type === SYMBOLS_ARRAY_TYPE && index < array.length - 1
			? { type: ERROR_TYPE, name: errorMessages.LAST_ELEMENT }
			: symbol
	))
	return { type: LINE_TYPE, symbols: validatedSymbolObjects }
}

function isValidPropName(name) {
	return name !== ''
}

module.exports = {
	parseToSyntaxStructure,
	types: { LINE_TYPE, EMPTY_LINE_TYPE, LINES_ARRAY_TYPE, ERROR_TYPE, SYMBOL_TYPE, SYMBOLS_ARRAY_TYPE },
}
