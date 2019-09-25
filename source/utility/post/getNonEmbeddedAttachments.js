import isEmbeddedAttachment from './isEmbeddedAttachment'

/**
 * Returns a list of non-embedded post attachments.
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