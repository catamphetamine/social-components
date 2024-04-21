import getPictureMinSize from './getPictureMinSize.js'

export default function getAttachmentThumbnailSize(attachment) {
	const picture = getAttachmentPicture(attachment)
	if (picture) {
		return getPictureMinSize(picture)
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
