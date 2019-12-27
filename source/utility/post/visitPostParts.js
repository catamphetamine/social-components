/**
 * Calls `visit(part)` on each part of `content` being of `type` type.
 * @param  {string} type
 * @param  {function} visit
 * @param  {any} content
 * @return {any[]} Results returned by each `visit()`.
 */
export default function visitPostParts(type, visit, part, $ = []) {
	if (Array.isArray(part)) {
		for (const subpart of part) {
			visitPostParts(type, visit, subpart, $)
		}
		return $
	}
	// Post content can be empty.
	// Or maybe even post part's content.
	// Like `{ type: 'attachment', attachmentId: 1 }`.
	if (!part) {
		return $
	}
	if (typeof part === 'string') {
		return $
	}
	if (part.type === type) {
		const result = visit(part)
		if (result !== undefined) {
			$.push(result)
		}
		return $
	}
	// Recurse into post parts.
	return visitPostParts(type, visit, part.content, $)
}
