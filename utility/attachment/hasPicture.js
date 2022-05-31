export default function attachmentHasPicture(attachment) {
	switch (attachment.type) {
		case 'picture':
			return true
		case 'video':
			return true
	}
}