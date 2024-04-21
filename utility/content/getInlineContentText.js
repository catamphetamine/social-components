import getPostText from '../post/getPostText.js'

export default function getInlineContentText(content, options) {
	if (typeof content === 'string') {
		content = [content]
	}
	return getPostText({ content: [content] }, options)
}