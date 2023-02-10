/**
 * Returns a type label for an attachment.
 * @param  {object} attachment
 * @param  {object} [messages] — Localized labels. See the description of "Messages" in the readme.
 * @return {string} [text]
 */
export default function getAttachmentTypeLabel(attachment, messages) {
	const blockContentTypeLabels = messages && messages.textContent && messages.textContent.block
	if (!blockContentTypeLabels) {
		return
	}
	switch (attachment.type) {
		case 'picture':
			return blockContentTypeLabels.picture
		case 'video':
			return blockContentTypeLabels.video
		case 'audio':
			return blockContentTypeLabels.audio
		case 'social':
			if (attachment.social.attachments) {
				for (const attachment of attachment.social.attachments) {
					const label = getAttachmentTypeLabel(attachment, blockContentTypeLabels)
					if (label) {
						return label
					}
				}
			}
			// `provider` is supposed to always be defined.
			return attachment.social.provider
		default:
			return blockContentTypeLabels.attachment
	}
}