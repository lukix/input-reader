function trimEmptyEdgeLines(lines) {
	return trimEmptyEndingLines(
		trimEmptyBeginningLines(lines)
	)
}
function trimEmptyBeginningLines(lines) {
	for(let i = 0; i < lines.length; i++) {
		if(lines[i] !== '') {
			return lines.slice(i)
		}
	}
}
function trimEmptyEndingLines(lines) {
	return trimEmptyBeginningLines(lines.reverse()).reverse()
}

module.exports = { trimEmptyEdgeLines, trimEmptyBeginningLines, trimEmptyEndingLines }