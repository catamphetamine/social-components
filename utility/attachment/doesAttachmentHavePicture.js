export default function doesAttachmentHavePicture(attachment) {
	switch (attachment.type) {
		case 'picture':
			return true
		case 'video':
			return true
	}
}