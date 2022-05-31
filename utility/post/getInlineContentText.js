import getPostText from './getPostText.js'

export default function getInlineContentText(content, options) {
	if (typeof content === 'string') {
		content = [content]
	}
	return getPostText({ content: [content] }, options)
}