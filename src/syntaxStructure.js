const LINE_TYPE = 'line'
const LINES_ARRAY_TYPE = 'linesArray'
const ERROR_TYPE = 'error'
const SYMBOL_TYPE = 'symbol'
const SYMBOLS_ARRAY_TYPE = 'symbolsArray'
const errorMessages = {
	lastElement: `'...' operator can be only used as the last symbol of the line`,
	onlyElement: `'...[]' operator must be the only element in the line`,
	invalidArrayName: `Invalid array name`,
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
		return { type: ERROR_TYPE, name: errorMessages.invalidArrayName }
	}
	const afterArrayStr = patternLine.split(']')[1]
	return whitespaceRegex.test(arrayName) || whitespaceRegex.test(afterArrayStr)
		? { type: ERROR_TYPE, name: errorMessages.onlyElement }
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
	const symbols = patternLine.split(whitespaceRegex)
	const symbolObjects = symbols.map((symbol) => (
		symbol.substr(0, 3) === '...'
			? !isValidPropName(symbol.substr(3))
				? { type: ERROR_TYPE, name: errorMessages.invalidArrayName }
				: { type: SYMBOLS_ARRAY_TYPE, name: symbol.substr(3) }
			: { type: SYMBOL_TYPE, name: symbol }
	))
	const validatedSymbolObjects = symbolObjects.map((symbol, index, array) => (
		symbol.type === SYMBOLS_ARRAY_TYPE && index < array.length - 1
			? { type: ERROR_TYPE, name: errorMessages.lastElement }
			: symbol
	))
	return { type: LINE_TYPE, symbols: validatedSymbolObjects }
}

function isValidPropName(name) {
	return name !== ''
}

module.exports = {
	parseToSyntaxStructure,
	types: { LINE_TYPE, LINES_ARRAY_TYPE, ERROR_TYPE, SYMBOL_TYPE, SYMBOLS_ARRAY_TYPE },
}