const zipLongest = require('zip-array').zip_longest
const { trimEmptyEdgeLines } = require('./trimLines.js')
const { convertToNumbers } = require('./convertToNumbers')
const {
	parseToSyntaxStructure,
	types: { LINE_TYPE, LINES_ARRAY_TYPE, SYMBOL_TYPE, SYMBOLS_ARRAY_TYPE },
} = require('./syntaxStructure')
const { checkForErrors } = require('./syntaxStructureErrorCheck.js')

function parseData(data, pattern, passedOptions = {}) {
	const defaultOptions = { convertToNumbers: true }
	const options = Object.assign({}, defaultOptions, passedOptions)
	const whitespaceRegex = /[ ,]+/
	const dataLines = trimEmptyEdgeLines(data.split('\n').map(line => line.trim()))
		.map(line => line.split(whitespaceRegex))
	const syntaxStructureObject = parseToSyntaxStructure(
		trimEmptyEdgeLines(pattern.split('\n')).join('\n')
	)
	const errorCheckResult = checkForErrors(syntaxStructureObject)
	if(errorCheckResult.error) {
		throw Error(`Error at line ${errorCheckResult.line}. ${errorCheckResult.message}`)
	} else {
		const dataObj = constructDataObject(dataLines, syntaxStructureObject)
		return options.convertToNumbers ? convertToNumbers(dataObj) : dataObj
	}
}

function constructDataObject(dataLines, patternLineObjects) {
	return patternLineObjects.map((patternLineObject, index) => {
		switch(patternLineObject.type) {
			case LINE_TYPE: return constructDataObjectFromSingleLine(dataLines[index], patternLineObject)
			case LINES_ARRAY_TYPE: return {
				[patternLineObject.name]: dataLines
					.slice(index)
					.map(dataLine => constructDataObjectFromSingleLine(dataLine, patternLineObject.innerPattern))
			}
			default: throw Error('Unexpected type')
		}
	}).reduce((resultObject, currObject) => Object.assign({}, resultObject, currObject), {})
}

function constructDataObjectFromSingleLine(dataLine, patternLineObject) {
	if(patternLineObject.type !== LINE_TYPE) {
		throw Error('Unexpected type')
	}

	return zipLongest(
		patternLineObject.symbols,
		dataLine.slice(0, patternLineObject.symbols.length)
	)
		.map(([symbol, data], index) => {
			switch(symbol.type) {
				case SYMBOLS_ARRAY_TYPE: return { [symbol.name]: dataLine.slice(index) }
				case SYMBOL_TYPE: return { [symbol.name]: data === undefined ? undefined : data }
				default: throw Error('Unexpected type')
			}
		})
		.reduce((resultObject, currObject) => Object.assign({}, resultObject, currObject), {})
}

module.exports = parseData