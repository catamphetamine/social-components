import getMinSize from '../picture/getMinSize'
import isEmbeddedAttachment from './isEmbeddedAttachment'
import getSortedAttachments from './getSortedAttachments'
// import countPostBlockCharacters from './countPostBlockCharacters'

export default function getPostThumbnail(post, { showPostThumbnailWhenThereAreMultipleAttachments }) {
	if (shouldCreateThumbnail(post, { showPostThumbnailWhenThereAreMultipleAttachments })) {
		return getAttachments(post).find((attachment) => {
			switch (attachment.type) {
				case 'picture':
					return attachment
				case 'video':
					// Only include uploaded attachments.
					// Skip YouTube and Vimeo videos.
					if (!attachment.video.provider) {
						return attachment
					}
			}
		})
	}
}

export function getPostThumbnailSize(attachment) {
	switch (attachment.type) {
		case 'picture':
			return getMinSize(attachment.picture)
		case 'video':
			// Only include uploaded attachments.
			// Skip YouTube and Vimeo videos.
			if (!attachment.video.provider) {
				return getMinSize(attachment.video.picture)
			}
	}
}

function getAttachments(post) {
	return getSortedAttachments(post).filter(_ => !isEmbeddedAttachment(_, post))
}

function shouldCreateThumbnail(post, { showPostThumbnailWhenThereAreMultipleAttachments }) {
	// If the post has no attachments then there'll be no post thumbnail.
	if (!post.attachments || post.attachments.length === 0) {
		return false
	}
	// If there's more than a single attachment
	// then don't show post thumbnail.
	if (!showPostThumbnailWhenThereAreMultipleAttachments) {
		if (getAttachments(post).length > 1) {
			return false
		}
	}
	// If the post isn't empty then show post thumbnail.
	if (post.content || post.title) {
		return true
	}
	// if (post.content) {
	// 	// If the post has both title and some content
	// 	// then it's long enough to show a post thumbnail.
	// 	if (post.title) {
	// 		return true
	// 	}
	// 	// If the post has no title but its content spans
	// 	// several "blocks" (paragraphs, etc), then it's long enough
	// 	// to show a post thumbnail.
	// 	if (Array.isArray(post.content) && post.content.length > 1) {
	// 		return true
	// 	}
	// 	// If the post has no title but its content spans
	// 	// several lines then it's long enough to show a post thumbnail.
	// 	const firstBlock = Array.isArray(post.content) ? post.content[0] : post.content
	// 	if (countPostBlockCharacters(firstBlock, 'lines') > 1) {
	// 		return true
	// 	}
	// }
}