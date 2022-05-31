// import addAttachment from './addAttachment'

// * In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.

/**
 * Expands attachment links (objects of shape `{ type: 'link', attachment: ... }`)
 * into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
 * @param  {Content} content
 */
export default function expandStandaloneAttachmentLinks(content) {
	if (!content) {
		return
	}
	let j = 0
	while (j < content.length) {
		const paragraph = content[j]
		// Only processes text paragraphs.
		if (!Array.isArray(paragraph)) {
			j++
			continue
		}
		let i = 0
		while (i < paragraph.length) {
			const element = paragraph[i]
			if (typeof element === 'object' &&
				element.type === 'link' &&
				element.attachment &&
				shouldExpandAttachment(element.attachment)) {
				const prevBlock = paragraph[i - 1]
				const nextBlock = paragraph[i + 1]
				if ((!prevBlock || prevBlock === '\n') && (!nextBlock || nextBlock === '\n')) {
					const blocks = []
					// Add previous paragraph.
					let beforeLinkContent
					if (i - 1 > 0) {
						// There may be more than one '\n' separating stuff.
						beforeLinkContent = trimNewLines(paragraph.slice(0, i - 1))
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
					// Add next paragraph.
					if (paragraph.length > i + 1) {
						// There may be more than one '\n' separating stuff.
						const afterLinkContent = trimNewLines(paragraph.slice(i + 1 + 1))
						if (afterLinkContent.length > 0) {
							blocks.push(afterLinkContent)
						}
					}
					// Replace the current paragraph with three blocks:
					// * Content of the paragraph before the link.
					// * The link that has been expanded into an attachment.
					// * Content of the paragraph after the link.
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