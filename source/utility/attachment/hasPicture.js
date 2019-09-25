export default function hasAttachmentPicture(attachment) {
	switch (attachment.type) {
		case 'picture':
			return true
		case 'video':
			return true
	}
}