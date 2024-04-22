import getContentBlocks from '../content/getContentBlocks.js'
import getPicturesAndVideos from '../attachment/getPicturesAndVideos.js'
import getEmbeddedAttachment from '../attachment/getEmbeddedAttachment.js'
import sortAttachmentsByThumbnailHeightDescending from '../attachment/sortAttachmentsByThumbnailHeightDescending.js'

/**
 * Sorts post attachments in the order they appear embedded in the `post`
 * plus all the rest of them that aren't embedded in the `post`,
 * sorted by thumbnail height descending.
 * @param  {object} post
 * @return {object[]} attachments — Returns post attachments sorted by the order in which they appear in the `post` content. Attachments that don't appear in the `post` content are at the end of the list.
 */
export default function getSortedAttachments(post) {
	if (!post.attachments) {
		return []
	}
	const attachments = post.attachments
	const embeddedAttachments = []
	// First add all embedded attachments.
	for (const block of getContentBlocks(post.content)) {
		if (typeof block === 'object' && block.type === 'attachment') {
			const attachment = getEmbeddedAttachment(block, attachments)
			if (attachment) {
				embeddedAttachments.push(attachment)
			}
		}
	}
	// Then add all the rest of the attachments sorted by thumbnail height descending.
	let restAttachments = attachments.filter(_ => embeddedAttachments.indexOf(_) < 0)
	const picturesAndVideos = getPicturesAndVideos(restAttachments)
	sortAttachmentsByThumbnailHeightDescending(picturesAndVideos)
	restAttachments = restAttachments.filter(_ => picturesAndVideos.indexOf(_) < 0)
		.sort(sortRestAttachments)
	return embeddedAttachments.concat(picturesAndVideos).concat(restAttachments)
}

const REST_ATTACHMENT_TYPES_ORDER = [
	'audio',
	'file',
	'social',
	'link'
]

function sortRestAttachments(a, b) {
	let aIndex = REST_ATTACHMENT_TYPES_ORDER.indexOf(a.type)
	let bIndex = REST_ATTACHMENT_TYPES_ORDER.indexOf(b.type)
	if (aIndex < 0) {
		aIndex = REST_ATTACHMENT_TYPES_ORDER.length
	}
	if (bIndex < 0) {
		bIndex = REST_ATTACHMENT_TYPES_ORDER.length
	}
	return aIndex - bIndex
}