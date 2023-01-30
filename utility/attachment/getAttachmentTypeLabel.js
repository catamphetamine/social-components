/**
 * Returns a type label for an attachment.
 * @param  {object} attachment
 * @param  {object} [contentTypeLabels] — An object of shape `{ picture: "Picture", video: "Video", ... }`.
 * @return {string} [text]
 */
export default function getAttachmentTypeLabel(attachment, contentTypeLabels) {
	switch (attachment.type) {
		case 'picture':
			return contentTypeLabels.picture
		case 'video':
			return contentTypeLabels.video
		case 'audio':
			return contentTypeLabels.audio
		case 'social':
			if (attachment.social.attachments) {
				for (const attachment of attachment.social.attachments) {
					const label = getAttachmentTypeLabel(attachment, contentTypeLabels)
					if (label) {
						return label
					}
				}
			}
			// `provider` is supposed to always be defined.
			return attachment.social.provider
		default:
			return contentTypeLabels.attachment
	}
}