const { createObject } = require('./createObject')

function convertToNumbers(object) {
	return typeof object === 'object'
		? Array.isArray(object)
			? object.map(item => convertToNumbers(item))
			: Object.keys(object).reduce((newObj, key) => (
					Object.assign({}, newObj, createObject(key, convertToNumbers(object[key])))
				), {})
		: Number.isNaN(Number(object))
			? object
			: Number(object)
}

module.exports = { convertToNumbers }