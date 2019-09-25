export default function getContentBlocks(content) {
	if (content === undefined || content === null) {
		return []
	}
	if (typeof content === 'string') {
		return [content]
	}
	return content
}