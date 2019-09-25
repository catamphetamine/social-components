// `fetch-jsonp` is not supported in Node.js.
module.exports = function() {
	throw new Error('"fetch-jsonp" is not supported in Node.js')
}