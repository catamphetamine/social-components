import getContentBlocks from './getContentBlocks.js'

// Transforms top-level `Content` using a `transform`ation function. Mutates the original `Content`.
// @param {Content} content — Top-level content. Should be "normalized" meaning that a `string` won't be accepted. Only an array of `BlockElement`s.
// @param {function} transform — Transforms a content element. A function of content element. If returns `false` then it means "don't change" and "don't recurse into the child elements". If returns `undefined` then it means "recurse into the child elements, if present".
export default function transformContent(content, transform) {
	content = getContentBlocks(content)
	// Transform each `BlockElement` of the `Content`.
	let i = 0
	while (i < content.length) {
		// Possible scenarios:
		// * (a) `ContentBlock` was an array (`InlineElement[]`) and was transformed into an array (`InlineElement[]`) — ok.
		// * (b) `ContentBlock` was an array (`InlineElement[]`) and was not transformed into an array — can't happen due to how the code is written.
		// * (c) `ContentBlock` was not an array (`BlockElement` or `string`) and was transformed into an array (`InlineElement[]`) — ok.
		// * (d) `ContentBlock` was not an array (`BlockElement` or `string`) and was transformed into a non-array (`BlockElement` or `string`) — ok.
		content[i] = transformContentPart(content[i], transform)
		i++
	}
}

/**
 * Transforms a `part` of content using the `transform()` function.
 * @param  {(string|object|any[])} part — Content element.
 * @param  {function} transform — Transforms a content element. A function of content element. If returns `false` then it means "don't change" and "don't recurse into the child elements". If returns `undefined` then it means "recurse into the child elements, if present".
 * @return {(string|object|any[])}
 */
function transformContentPart(part, transform) {
	if (Array.isArray(part)) {
		let transformedPart = []
		for (const subpart of part) {
			transformedPart = transformedPart.concat(transformContentPart(subpart, transform))
		}
		return transformedPart
	} else {
		// Transform the `part`.
		const transformedPart = transform(part)
		// Returning `undefined` means "recurse into the child elements, if present".
		if (transformedPart === undefined) {
			// If the `part` is a content block having internal `content`,
			// recurse into that internal `content`.
			const internalContent = typeof part === 'string' ? undefined : part.content
			if (internalContent) {
				let transformedContent = transformContentPart(internalContent, transform)
				// If the internal `content` before the transformation was a string
				// and after the transformation it became not a string then the only thing
				// that it could become after the transformation is an array of `InlineElement`s
				// because by definition `InlineContent` could be either a `string` or a list of `InlineElement`s.
				const wasString = typeof internalContent === 'string'
				const becameString = typeof transformedContent === 'string'
				const becameInlineElements = Array.isArray(transformedContent)
				const becameInlineElement = !becameString && !becameInlineElements
				if (becameInlineElement) {
					// Transform `InlineElement` into a list of `InlineElement`s
					// so that `transformedContent` represents a valid `InlineContent`.
					transformedContent = [transformedContent]
				}
				return {
					...part,
					content: transformedContent
				}
			}
			// No changes.
			return part
		} else if (transformedPart === false) {
			// Returning `false` means "no changes" and "don't recurse into the child elements".
			return part
		} else {
			return transformedPart
		}
	}
}