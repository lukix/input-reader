function convertToNumbers(object) {
	return typeof object === 'object' && object !== null
		? Array.isArray(object)
			? object.map(item => convertToNumbers(item))
			: Object.entries(object).reduce((newObj, [key, value]) => (
					Object.assign({}, newObj, { [key]: convertToNumbers(value) })
				), {})
		: typeof object === 'string' && !Number.isNaN(Number(object))
			? Number(object)
			: object
}

module.exports = { convertToNumbers }
