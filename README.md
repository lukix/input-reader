# input-reader
JavaScript library for reading whitespace-separated data, which is a common input data format for tasks in many algorithmic competitions.

## Quick Start
### Installation
```bash
npm install --save input-reader
```

### Example usage
```javascript
const reader = require('input-reader')
const data = `
    4 2
    9 1 2 3
`
const pattern = `
	a b
	c ...arr
`
reader(data, pattern) // { a: 4, b: 2, c: 9, arr: [1, 2, 3] }
```

## API
Module exports single function, which takes three parameters:
```javascript
reader(data, pattern, options)
```
**Parameters:**
* **data** - string containing input data.
* **pattern** - string describing how **data** should be mapped to the returned object.
* **options** - object specifying additional behaviour. Optional.

**Return value:**
* Object containing input data placed in properties sepecified by **pattern** parameter.

### Pattern syntax
**Single-line mapping**
```javascript
const data = '1 2'
const pattern = 'foo bar'
reader(data, pattern) // { foo: 1, bar: 2 }
```

**Multi-line mapping**
```javascript
const data = `
    1 2
    3 4 5
`
const pattern = `
	foo bar
	a b c
`
reader(data, pattern) // { foo: 1, bar: 2, a: 3, b: 4, c: 5 }
```

**Rest operator**
Rest operator collects all the remaining elements of the line into an array. It must be used as the last symbol of the line.
```javascript
const data = `
    1 2 3 4
`
const pattern = `
	foo ...bar
`
reader(data, pattern) // { foo: 1, bar: [2, 3, 4] }
```

**Multi-line rest operator**
Multi-line rest operator collects all the remaining lines into an array. It can be only used in the last line of a pattern string.
```javascript
const data = `
    9
    8 7
    6 5
`
const pattern = `
	foo
	...bar[a b]
`
reader(data, pattern) // { foo: 9, bar: [{ a: 8, b: 7 }, { a: 6, b: 5 }] }
```

**Nested rest operator**
```javascript
const data = `
    9
    1 2 3 4
    5 6 7 8
`
const pattern = `
	foo
	...bar[a ...b]
`
reader(data, pattern) // { foo: 9, bar: [{ a: 1, b: [2, 3, 4] }, { a: 5, b: [6, 7, 8] }] }
```

**Convert to numbers**
```javascript
const data = '1 hello'
const pattern = 'foo bar'
reader(data, pattern, { convertToNumbers: true }) // { foo: 1, bar: 'hello' }
reader(data, pattern, { convertToNumbers: false }) // { foo: '1', bar: 'hello' }
```

### Options
Property&nbsp;Name | Type | Default&nbsp;Value | Description
--- | --- | --- | ---
convertToNumbers | boolean | true | If true, all elements will be converted to *Number* type. If conversion results in *NaN* value, then the original type and value will be left.