import getContentBlocks from './getContentBlocks'
import { getThumbnailSize } from './attachment'

/**
 * Sorts post attachments in the order they appear embedded in the post
 * plus all the rest of them that aren't embedded sorted by thumbnail height descending.
 * @param  {object} post
 * @return {object[]} attachments
 */
export default function getSortedAttachments(post) {
	if (!post.attachments) {
		return
	}
	const attachments = post.attachments
	const sortedAttachments = []
	// First add all embedded attachments.
	for (const block of getContentBlocks(post.content)) {
		if (typeof block === 'object' && block.type === 'attachment') {
			const attachment = attachments.find(_ => _.id === block.attachmentId)
			if (attachment) {
				sortedAttachments.push(attachment)
			}
		}
	}
	// Then add all the rest of the attachments sorted by thumbnail height descending.
	const restAttachments = attachments.filter(_ => !sortedAttachments.includes(_))
	return sortedAttachments.concat(sortByThumbnailHeightDescending(restAttachments))
}

export function sortByThumbnailHeightDescending(attachments) {
	// A minor optimization.
	if (attachments.length === 1) {
		return attachments
	}
	return attachments.sort((a, b) => {
		return getAttachmentThumbnailHeight(b) - getAttachmentThumbnailHeight(a)
	})
}

function getAttachmentThumbnailHeight(attachment) {
	const thumbnailSize = getThumbnailSize(attachment)
	if (thumbnailSize) {
		return thumbnailSize.height
	} else {
		console.error(`Unsupported attachment type for "getAttachmentThumbnailHeight()": ${attachment.type}`)
		console.log(attachment)
		return 0
	}
}