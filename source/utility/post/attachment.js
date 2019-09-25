import { getMinSize } from '../picture'

export function getThumbnailSize(attachment) {
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

export function hasAttachmentPicture(attachment) {
	switch (attachment.type) {
		case 'picture':
			return true
		case 'video':
			return true
	}
}