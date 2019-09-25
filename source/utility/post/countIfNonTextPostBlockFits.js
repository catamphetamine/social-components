import getAttachmentCharacterPoints from './getAttachmentCharacterPoints'

export default function countIfNonTextPostBlockFits(block, post, countIfFits) {
	const blockType = CONTENT_BLOCKS[block.type]
	if (!blockType) {
		console.error(`Unsupported post block type: ${block.type}`)
		return
	}
	let _block = block
	if (block.type === 'attachment') {
		_block = post.attachments.find(_ => _.id === block.attachmentId)
		if (!_block) {
			console.error(`Attachment ${block.attachmentId} not found`)
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