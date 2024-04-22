import getContentBlocks from './getContentBlocks.js'

/**
 * Expands attachment links (objects of shape `{ type: 'link', attachment: ... }`)
 * into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
 * @param  {Content} content
 */
export default function expandStandaloneAttachmentLinks(content) {
	content = getContentBlocks(content)
	let j = 0
	while (j < content.length) {
		const contentBlock = content[j]
		// Only processes text contentBlocks.
		if (!Array.isArray(contentBlock)) {
			j++
			continue
		}
		let i = 0
		while (i < contentBlock.length) {
			const element = contentBlock[i]
			if (typeof element === 'object' &&
				element.type === 'link' &&
				element.attachment &&
				shouldExpandAttachment(element.attachment)) {
				const prevBlock = contentBlock[i - 1]
				const nextBlock = contentBlock[i + 1]
				if ((!prevBlock || prevBlock === '\n') && (!nextBlock || nextBlock === '\n')) {
					const blocks = []
					// Add previous contentBlock.
					let beforeLinkContent
					if (i - 1 > 0) {
						// There may be more than one '\n' separating stuff.
						beforeLinkContent = trimNewLines(contentBlock.slice(0, i - 1))
						if (beforeLinkContent.length > 0) {
							blocks.push(beforeLinkContent)
						}
					}
					// Add an embedded block-level attachment.
					// Embed the attachment in the `content`.
					blocks.push({
						type: 'attachment',
						attachment: element.attachment
					})
					// Could add the attachment to `post.attachments`
					// instead of embedding it in the `content`.
					// blocks.push({
					// 	type: 'attachment',
					// 	attachmentId: addAttachment(post, element.attachment)
					// })
					// Add next contentBlock.
					if (contentBlock.length > i + 1) {
						// There may be more than one '\n' separating stuff.
						const afterLinkContent = trimNewLines(contentBlock.slice(i + 1 + 1))
						if (afterLinkContent.length > 0) {
							blocks.push(afterLinkContent)
						}
					}
					// Replace the current contentBlock with three blocks:
					// * Content of the contentBlock before the link.
					// * The link that has been expanded into an attachment.
					// * Content of the contentBlock after the link.
					content.splice(j, 1, ...blocks)
					// Adjust the next block index.
					if (beforeLinkContent) {
						j++
					}
					break
				}
			}
			i++
		}
		j++
	}
}

function trimNewLines(array) {
	while (array[0] === '\n') {
		array = array.slice(1)
	}
	while (array[array.length - 1] === '\n') {
		array = array.slice(0, array.length - 1)
	}
	return array
}

function shouldExpandAttachment(attachment) {
	switch (attachment.type) {
		case 'audio':
		case 'video':
		case 'picture':
			return true
		case 'social':
			switch (attachment.social.provider) {
				case 'Instagram':
				case 'Twitter':
					return true
				default:
					return false
			}
		default:
			return false
	}
}