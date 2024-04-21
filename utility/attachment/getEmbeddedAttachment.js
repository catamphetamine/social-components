/**
 * Returns an `attachment` object for a `type="attachment"` block.
 * @param  {object} block — A `type="attachment"` block.
 * @param  {Attachment[]} [attachments] — Post attachments.
 * @return {Attachment} [attachment]
 */
export default function getEmbeddedAttachment(block, attachments) {
	if (block.attachment) {
		return block.attachment
	}
	if (block.attachmentId) {
		// `if (attachments)` is just a simple guard against some
		// hypothetical cases when `post.attachments` is (incorrectly) missing
		// and there's a reference to an attachment by its ID.
		if (attachments) {
			return attachments.find(_ => _.id === block.attachmentId)
		} else {
			// Shouldn't normally happen.
			console.error(`"attachments" missing when getting embedded attachment for:\n\n${JSON.stringify(block, null, 2)}`)
		}
	}
}