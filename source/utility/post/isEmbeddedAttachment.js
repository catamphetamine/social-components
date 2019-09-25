import getContentBlocks from './getContentBlocks'

export default function isEmbeddedAttachment(attachment, post) {
	if (attachment.id) {
		return getContentBlocks(post.content).findIndex((block) => {
			return typeof block === 'object' &&
				block.type === 'attachment' &&
				block.attachmentId === attachment.id
		}) >= 0
	}
}