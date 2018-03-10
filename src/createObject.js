function createObject(propName, propValue) {
	const object = {}
	object[propName] = propValue
	return object
}

module.exports = { createObject }