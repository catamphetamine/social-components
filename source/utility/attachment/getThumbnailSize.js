import getMinSize from '../picture/getMinSize'

export default function getThumbnailSize(attachment) {
	const picture = getAttachmentPicture(attachment)
	if (picture) {
		return getMinSize(picture)
	}
}

function getAttachmentPicture(attachment) {
	switch (attachment.type) {
		case 'picture':
			return attachment.picture
		case 'video':
			return attachment.video.picture
	}
}
