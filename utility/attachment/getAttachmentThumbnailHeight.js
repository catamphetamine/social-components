import getAttachmentThumbnailSize from './getAttachmentThumbnailSize.js'

export default function getAttachmentThumbnailHeight(attachment) {
	const thumbnailSize = getAttachmentThumbnailSize(attachment)
	if (thumbnailSize) {
		return thumbnailSize.height
	} else {
		console.error(`Unsupported attachment type for "getAttachmentThumbnailHeight()": ${attachment.type}`)
		console.log(attachment)
		return 0
	}
}