/**
 * Calls `visit(part)` on each part of `content` being of `type` type.
 * @param  {string} type
 * @param  {function} visit
 * @param  {(string|any[])} [content]
 * @return {any[]} Results returned by each `visit()`.
 */
export default function visitContentParts(type, visit, part, $ = []) {
	// Post content can be empty.
	// Or maybe even post part's content.
	// Like `{ type: 'attachment', attachmentId: 1 }`.
	if (!part) {
		return $
	}
	if (typeof part === 'string') {
		return $
	}
	if (Array.isArray(part)) {
		for (const subpart of part) {
			visitContentParts(type, visit, subpart, $)
		}
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
	return visitContentParts(type, visit, part.content, $)
}
