import addAttachment from './addAttachment'

/**
 * Expands attachment links (objects of shape `{ type: 'link', attachment: ... }`)
 * into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
 * In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
 * @param  {object} post
 */
export default function expandStandaloneAttachmentLinks(post) {
	if (!post.content) {
		return
	}
	let j = 0
	while (j < post.content.length) {
		const paragraph = post.content[j]
		// Only processes text paragraphs.
		if (!Array.isArray(paragraph)) {
			j++
			continue
		}
		let i = 0
		while (i < paragraph.length) {
			const block = paragraph[i]
			if (typeof block === 'object' &&
				block.type === 'link' &&
				block.attachment &&
				shouldExpandAttachment(block.attachment)) {
				const prevBlock = paragraph[i - 1]
				const nextBlock = paragraph[i + 1]
				if ((!prevBlock || prevBlock === '\n') && (!nextBlock || nextBlock === '\n')) {
					const paragraphs = []
					// Add previous paragraph.
					let prevParagraph
					if (i - 1 > 0) {
						// There may be more than one '\n' separating stuff.
						prevParagraph = trimNewLines(paragraph.slice(0, i - 1))
						if (prevParagraph.length > 0) {
							paragraphs.push(prevParagraph)
						}
					}
					// Add current paragraph (block-level attachment).
					paragraphs.push({
						type: 'attachment',
						attachmentId: addAttachment(post, block.attachment)
					})
					// Add next paragraph.
					if (paragraph.length > i + 1) {
						// There may be more than one '\n' separating stuff.
						const nextParagraph = trimNewLines(paragraph.slice(i + 1 + 1))
						if (nextParagraph.length > 0) {
							paragraphs.push(nextParagraph)
						}
					}

					post.content.splice(j, 1, ...paragraphs)

					if (prevParagraph) {
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