const {
	types: { LINES_ARRAY_TYPE, ERROR_TYPE, SYMBOLS_ARRAY_TYPE },
} = require('./syntaxStructure')

function checkForErrors(syntaxStructure) {
	return syntaxStructure.reduce((result, line, lineIndex) => {
		const lineResult = line.type === LINES_ARRAY_TYPE
			? checkLineForErrors(line.innerPattern)
			: line.type !== SYMBOLS_ARRAY_TYPE
				? checkLineForErrors(line)
				: { error: false }
		return lineResult.error
			? Object.assign({}, lineResult, { line: lineIndex })
			: result
	}, { error: false })
}
function checkLineForErrors(lineSyntaxStructure) {
	return lineSyntaxStructure.type === ERROR_TYPE
		? { error: true, message: lineSyntaxStructure.name }
		: lineSyntaxStructure.symbols.reduce((lastError, symbol) => (
				symbol.type === ERROR_TYPE
					? { error: true, message: symbol.name }
					: lastError
		), { error: false })
}

module.exports = { checkForErrors }
