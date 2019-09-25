/**
 * Splits `content` by the `indexPath` path into `leftPart` and `rightPart`.
 * @param  {any}  content
 * @param  {number[]}  indexPath
 * @param  {function}  [options.transformSplitPoint] — Can be used, for example, to trim the split point text.
 * @param  {number}  [options.skip] — How much elements to skip after the split point. The skipped elements won't be part of neither the `leftPart` nor the `rightPart`.
 * @param  {boolean}  [options.include] — Whether to include the split point in the left part. Is `true` by default.
 * @return {any[]} Returns an array `[leftPart: any[], rightPart: any[]]`.
 */
export default function splitContent(content, indexPath, options = {}, isRoot = true) {
	let left = []
	let right = []
	let i = 0
	while (i < content.length) {
		if (i === indexPath[0]) {
			// If the final split point is reached.
			if (indexPath.length === 1) {
				// Include the split point in result.
				if (options.include !== false) {
					if (options.transformSplitPoint) {
						const splitPoint = options.transformSplitPoint(content[i])
						if (splitPoint) {
							left.push(splitPoint)
						}
					} else {
						left.push(content[i])
					}
				}
				// Skip some elements after split point.
				// For example, "\n"s.
				if (options.skip) {
					i += options.skip
				}
			} else {
				const [leftChildren, rightChildren] = splitContent(
					Array.isArray(content[i]) ? content[i] : content[i].content,
					indexPath.slice(1),
					options,
					Array.isArray(content[i]) && isRoot ? true : false // `isRoot`
				)
				if (leftChildren) {
					if (Array.isArray(content[i])) {
						left.push(leftChildren)
					} else {
						left.push({
							// Clone the properties of the content part being split.
							...content[i],
							content: leftChildren
						})
					}
				}
				if (rightChildren) {
					if (Array.isArray(content[i])) {
						right.push(rightChildren)
					} else {
						right.push({
							// Clone the properties of the content part being split.
							...content[i],
							content: rightChildren
						})
					}
				}
			}
		} else if (i < indexPath[0]) {
			left.push(content[i])
		} else {
			right.push(content[i])
		}
		i++
	}
	return [
		normalize(left, isRoot),
		normalize(right, isRoot)
	]
}

/**
 * "Normalizes" `content`.
 * Converts empty arrays to `undefined`
 * and arrays of strings to just strings.
 * Example: `{ type: 'link', content: ['text'] }` -> `{ type: 'link', content: 'text' }`.
 * @param  {any}  content
 * @param  {Boolean} isRoot — `true` for the root element of post content, so that both `leftPart` and `rightPart` are arrays (for some reason; perhaps it's easier to handle this way in the calling code).
 * @return {any} "Normalized" content.
 */
function normalize(content, isRoot) {
	if (content.length === 0) {
		return
	}
	if (!isRoot) {
		if (content.length === 1 && typeof content[0] === 'string') {
			return content[0]
		}
	}
	return content
}