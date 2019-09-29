export default function getAttachmentMessage(attachment, messages) {
	switch (attachment.type) {
		case 'picture':
			return messages.picture
		case 'video':
			return messages.video
		case 'audio':
			return messages.audio
		case 'social':
			if (attachment.social.attachments) {
				for (const attachment of attachment.social.attachments) {
					const message = getAttachmentMessage(attachment, messages)
					if (message) {
						return message
					}
				}
			}
			return attachment.social.provider
		default:
			return messages.attachment
	}
}