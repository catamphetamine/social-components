export default function validateContentFormat(content) {
	if (!Array.isArray(content)) {
		throw new Error('`content` must be an array of `ContentBlock`s. If you\'re passing a `string`, convert it to a `[[string]]`. If you\'re passing `undefined`, don\'t pass it.')
	}
}