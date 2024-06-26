import getContentBlocks from './getContentBlocks.js'
import trimInlineContent from './trimInlineContent.js'

/**
 * Trims whitespace (including newlines)
 * in the beginning and in the end of `content`.
 * *** `content` internals will be mutated. ***
 * @param  {any[][]} content
 * @param  {boolean} [options.left] — Pass `left: false` option to prevent it from trimming on the left side.
 * @param  {boolean} [options.left] — Pass `right: false` option to prevent it from trimming on the right side.
 * @return {any[][]} [result] Returns the mutated `content` (the original `content` still gets mutated). Returns `undefined` if `content` became empty as a result of the trimming.
 */
export default function trimContent(content, options = {}) {
	content = getContentBlocks(content)
	// // `content` internals will be mutated.
	// content = content.slice()
	let i = 0
	while (i < content.length) {
		const block = content[i]
		// A top-level content block is not neccessarily a paragraph of text.
		// It could also be an embedded video or an embedded picture, for example.
		// A paragraph of text is always an array.
		if (Array.isArray(block)) {
			trimInlineContent(block, options)
			if (block.length === 0) {
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