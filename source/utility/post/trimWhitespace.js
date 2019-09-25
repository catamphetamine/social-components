/**
 * Trims whitespace (including newlines)
 * in the beginning and in the end.
 * *** `content` internals will be mutated. ***
 * @param  {any[][]} content
 * @return {any[][]} [result]
 */
export default function trimWhitespace(content, options = {}) {
	// `content` internals will be mutated.
	// content = content.slice()
	let i = 0
	while (i < content.length) {
		const paragraph = content[i]
		// Could be an embedded video.
		// (not necessarily an array)
		if (Array.isArray(paragraph)) {
			if (options.left !== false) {
				trim(paragraph, 'left')
			}
			if (options.right !== false) {
				trim(paragraph, 'right')
			}
			if (paragraph.length === 0) {
				content.splice(i, 1)
				i--
			}
		}
		i++
	}
	if (content.length > 0) {
		return content
	}
}

const START_WHITESPACE = /^\s+/
const END_WHITESPACE = /\s+$/

/**
 * Trims inline content at one side.
 * *** Mutates the `content` passed ***
 * @param {any[]} content — Inline content.
 * @param {string} side — Either "left" or "right".
 */
export function trim(content, side) {
	let i = side === 'left' ? 0 : content.length - 1
	let whitespaceTrimmed = false
	while (side === 'left' ? i < content.length : i >= 0) {
		if (typeof content[i] === 'string') {
			const trimmedText = content[i].replace(side === 'left' ? START_WHITESPACE : END_WHITESPACE, '')
			if (!trimmedText) {
				whitespaceTrimmed = true
				content.splice(i, 1)
				if (side === 'left') {
					i--
				}
			} else {
				if (trimmedText !== content[i]) {
					whitespaceTrimmed = true
				}
				content[i] = trimmedText
				// Non-whitespace content found.
				return whitespaceTrimmed
			}
		} else if (content[i].type === 'emoji') {
			// An emoji found.
			// Non-whitespace content found.
			return whitespaceTrimmed
		} else if (content[i].content) {
			let contentArray = content[i].content
			if (!Array.isArray(contentArray)) {
				contentArray = [contentArray]
			}
			const trimmed = trim(contentArray, side)
			if (trimmed) {
				whitespaceTrimmed = true
			}
			if (contentArray.length === 0) {
				// Remove the empty part and proceed.
				content.splice(i, 1)
				if (side === 'left') {
					i--
				}
			} else {
				// The content was possibly trimmed so update it.
				if (Array.isArray(content[i].content)) {
					content[i].content = contentArray
				} else {
					content[i].content = contentArray[0]
				}
				// Non-whitespace content found (and possibly trimmed from whitespace).
				return whitespaceTrimmed
			}
		} else {
			console.error(`No "content" is present for an inline-level paragraph part at index ${i}`)
			console.error(content)
		}
		if (side === 'left') {
			i++
		} else {
			i--
		}
	}
	return whitespaceTrimmed
}