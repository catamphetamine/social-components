export default function forEachFollowingQuote(content, startIndex, action) {
	let count = 0
	let i = startIndex
	while (i < content.length) {
		if (typeof content[i] !== 'object') {
			break
		}
		if (content[i].type !== 'quote') {
			break
		}
		action(content[i], i)
		count++
		i++
		if (i === content.length) {
			break
		}
		if (content[i] !== '\n') {
			break
		}
		i++
	}
	return count
}