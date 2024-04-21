/**
 * Recursively searches `content` for the parts for which the `test(part)` function returns `true`.
 * @param  {any[]} content — A content paragraph (an array) or content (an array of arrays).
 * @param  {function} test — `function(part: string, parentArray?: any[], indexInParentArray?: number): boolean?`
 * @param  {boolean} [options.backwards] — Pass `true` to search from the end to the start of the `content`.
 * @return {number[]} [indexPath] Returns an "index path" (an array of recursive content part indexes, like a path in a "tree").
 */
export default function findContentPart(content, test, options = {}) {
	if (!Array.isArray(content)) {
		throw new Error('Non-array content passed to "findContentPart"')
	}
	let i = options.backwards ? content.length - 1 : 0
	while (options.backwards ? i >= 0 : i < content.length) {
		const getNextPart = skip => content[i + skip]
		if (Array.isArray(content[i])) {
			const indexes = findContentPart(content[i], test, options)
			if (indexes) {
				return [i].concat(indexes)
			}
		} else if (typeof content[i] === 'string') {
			if (test(content[i], { getNextPart })) {
				return [i]
			}
		} else {
			if (test(content[i], { getNextPart })) {
				return [i]
			}
			if (content[i].type === 'emoji') {
				// Ignore emojis: don't search in emoji's `.content`.
				// (emoji's `.content` is a textual representation of an emoji)
			} else if (content[i].content) {
				if (Array.isArray(content[i].content)) {
					// Recurse into child content.
					const indexes = findContentPart(content[i].content, test, options)
					if (indexes) {
						return [i].concat(indexes)
					}
				} else if (typeof content[i].content === 'string') {
					if (test(content[i].content, { getNextPart })) {
						return [i]
					}
				} else {
					// `.content` is supposed to be either an array or a string.
					console.error('Unsupported type of `.content` of:', content[i])
					// Ignore this post part.
				}
			}
			// I can imagine some inline-level post parts not having `content`
			// being hypothetically added in some potential future (though unlikely).
			else  {
				console.error(`No "content" is present for an inline-level paragraph part at index ${i}`)
				console.error(content)
			}
		}
		options.backwards ? i-- : i++
	}
}
