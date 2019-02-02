const {
	types: { LINES_ARRAY_TYPE, EMPTY_LINE_TYPE, ERROR_TYPE, SYMBOLS_ARRAY_TYPE },
} = require('./syntaxStructure')

function checkForErrors(syntaxStructure) {
	return syntaxStructure.reduce((result, line, lineIndex) => {
		const lineResult = line.type === LINES_ARRAY_TYPE
			? checkLineForErrors(line.innerPattern)
			: line.type !== SYMBOLS_ARRAY_TYPE
				? checkLineForErrors(line)
				: { error: false }
		return lineResult.error
			? { ...lineResult, line: lineIndex }
			: result
	}, { error: false })
}
function checkLineForErrors(lineSyntaxStructure) {
	if(lineSyntaxStructure.type === ERROR_TYPE)
		return { error: true, message: lineSyntaxStructure.name }
	if (lineSyntaxStructure.type === EMPTY_LINE_TYPE)
		return { error: false }
	return lineSyntaxStructure.symbols.reduce((lastError, symbol) => (
			symbol.type === ERROR_TYPE
				? { error: true, message: symbol.name }
				: lastError
	), { error: false })
}

module.exports = { checkForErrors }
