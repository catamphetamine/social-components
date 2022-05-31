/**
 * Adds an attachment to the list of post attachments.
 * @param {object} post
 * @param {object} attachment
 * @return {number} attachmentId
 */
export default function addAttachment(post, attachment, options) {
	const attachmentId = getNextAttachmentId(post.attachments)
	post.attachments = post.attachments || []
	post.attachments.push({
		id: attachmentId,
		...attachment,
		...options
	})
	return attachmentId
}

function getNextAttachmentId(attachments) {
	let maxId = 0
	if (attachments) {
		for (const attachment of attachments) {
			if (attachment.id) {
				maxId = Math.max(maxId, attachment.id)
			}
		}
	}
	return maxId + 1
}