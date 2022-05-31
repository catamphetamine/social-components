import isEmbeddedAttachment from './isEmbeddedAttachment.js'

/**
 * Returns a list of post attachments that aren't embedded in the `post`'s `.content`.
 * @param  {object} post
 * @return {object[]}
 */
export default function getNonEmbeddedAttachments(post) {
	const attachments = post.attachments || []
	const nonEmbeddedAttachments = attachments.filter(_ => !isEmbeddedAttachment(_, post))
	if (nonEmbeddedAttachments.length === attachments.length) {
		return attachments
	}
	return nonEmbeddedAttachments
}