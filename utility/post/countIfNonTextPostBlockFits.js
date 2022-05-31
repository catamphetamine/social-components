import getAttachmentCharacterPoints from './getAttachmentCharacterPoints.js'
import getEmbeddedAttachment from './getEmbeddedAttachment.js'

/**
 * Counts the "points" of a non-text block (picture, video)
 * and determines if it "fits" (using the supplied `countIfFits` function).
 * @param  {object} block
 * @param  {object[]} [attachments]
 * @param  {function} countIfFits
 * @return {(boolean|object)} [result] Returns `true` if the `block` fits entirely. Returns a shortened `block` if the `block` fits partially (for example, a `list`). Returns nothing if the `block` doesn't fit.
 */
export default function countIfNonTextPostBlockFits(block, attachments, countIfFits) {
	const blockType = CONTENT_BLOCKS[block.type]
	if (!blockType) {
		console.error(`Unsupported post block type: ${block.type}`)
		return
	}
	let _block = block
	if (block.type === 'attachment') {
		_block = getEmbeddedAttachment(block, attachments)
		if (!_block) {
			console.error(`Attachment not found for block:\n\n${JSON.stringify(block, null, 2)}`)
			return
		}
	}
	return blockType.countIfFits(_block, countIfFits)
}

const CONTENT_BLOCKS = {
	'attachment': {
		countIfFits(attachment, countIfFits) {
			return countIfFits(getAttachmentCharacterPoints(attachment), 1)
		}
	},
	'heading': {
		countIfFits(block, countIfFits) {
			return countIfFits(block.content)
		}
	},
	'code': {
		countIfFits(block, countIfFits) {
			return countIfFits(block.content)
		}
	},
	'list': {
		countIfFits(block, countIfFits) {
			const trimmedItems = []
			let i = 0
			while (i < block.items.length) {
				const item = block.items[i]
				if (!countIfFits(item)) {
					break
				}
				trimmedItems.push(item)
				if (i < block.items.length - 1 && !countIfFits('\n')) {
					break
				}
				i++
			}
			if (trimmedItems.length === block.items.length) {
				return true
			} else if (trimmedItems.length > 0 && trimmedItems.length < block.items.length) {
				return {
					...block,
					items: trimmedItems
				}
			}
		}
	},
	'quote': {
		countIfFits(block, countIfFits) {
			return countIfFits(block.source) && countIfFits(block.content)
		}
	}
}