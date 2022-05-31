/**
 * Trims whitespace (including newlines)
 * in the beginning and in the end of an inline `content` (must be an array).
 * *** Mutates the `content`. ***
 * @param  {any[]} content
 * @param  {boolean} [options.left] — Pass `left: false` option to prevent it from trimming on the left side.
 * @param  {boolean} [options.left] — Pass `right: false` option to prevent it from trimming on the right side.
 * @return {any[]} [result] Returns the mutated `content` (the original `content` still gets mutated). Returns `undefined` if `content` became empty as a result of the trimming.
 */
export default function trimInlineContent(content, options = {}) {
	if (options.left !== false) {
		trimInlineContentOnSide(content, 'left')
	}
	if (options.right !== false) {
		trimInlineContentOnSide(content, 'right')
	}
	if (content.length > 0) {
		return content
	}
}

const LEADING_WHITESPACE = /^\s+/
const TRAILING_WHITESPACE = /\s+$/

/**
 * Trims inline content at one side.
 * *** Mutates the `content`. ***
 * @param {any[]} content — Inline content.
 * @param {string} side — Either "left" or "right".
 * @return {boolean} [didTrimWhitespace]
 */
export function trimInlineContentOnSide(content, side) {
	let i = side === 'left' ? 0 : content.length - 1
	let whitespaceTrimmed = false
	while (side === 'left' ? i < content.length : i >= 0) {
		if (typeof content[i] === 'string') {
			const trimmedText = content[i].replace(side === 'left' ? LEADING_WHITESPACE : TRAILING_WHITESPACE, '')
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
			const trimmed = trimInlineContentOnSide(contentArray, side)
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