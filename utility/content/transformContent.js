export default function transformContent(content, transform) {
	if (!Array.isArray(content)) {
		// "Normalized" content means that it's an array of blocks,
		// and strings can't be block-level.
		throw new Error('Non-normalized content passed to "transformContent"')
	}
	let i = 0
	while (i < content.length) {
		// Theoretically, there could exist a hypothetical case
		// when someone transforms a block into two blocks,
		// but such cases won't be supported in the current implementation.
		content[i] = transformContentPart(content[i], transform)
		i++
	}
}

/**
 * Transforms a `part` of content using the `transform()` function.
 * @param  {(string|object|any[])} part
 * @param  {function} transform
 * @return {(string|object|any[])}
 */
function transformContentPart(part, transform) {
	if (Array.isArray(part)) {
		let newPart = []
		for (const subpart of part) {
			newPart = newPart.concat(transformContentPart(subpart, transform))
		}
		return newPart
	} else {
		const result = transform(part)
		if (result === undefined) {
			if (typeof part !== 'string' && part.content !== undefined) {
				let result = transformContentPart(part.content, transform)
				if (typeof part.content === 'string') {
					if (typeof result !== 'string') {
						if (!Array.isArray(result)) {
							result = [result]
						}
					}
				}
				part.content = result
			}
			return part
		} else if (result === false) {
			return part
		} else if (Array.isArray(result)) {
			return result
		} else {
			return result
		}
	}
}