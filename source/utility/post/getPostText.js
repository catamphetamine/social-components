// import getSocialText from '../social/getSocialText'
import getAttachmentText from '../attachment/getAttachmentText'
import getAttachmentMessage from '../attachment/getAttachmentMessage'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress'
import { getDomainName } from '../url'

/**
 * Converts post content to text.
 * Removes `post-link`s and their autogenerated `quotes`.
 * Can optionally ignore attachments (or skip them unless there's no text).
 * Can optionally exclude `quote`s.
 * @param  {any} [content] — Post `content` or a post paragraph.
 * @param  {object[]} [attachments] — Attachments used (embedded, linked) in `content`.
 * @param  {number} [options.softLimit]
 * @param  {object} [options.messages]
 * @param  {boolean} [options.skipPostQuotes] — Skip all other post quotes.
 * @param  {boolean} [options.skipAutogeneratedPostQuotes] — Skip all autogenerated other post quotes.
 * @param  {boolean} [options.usePlaceholderForCodeBlocks] — Skip code blocks.
 * @param  {boolean} [options.skipAttachments] — Skip attachments (embedded and non-embedded).
 * @param  {boolean} [options.stopOnNewLine]
 * @return {string}
 */
export default function getPostText(content, attachments, options = {}) {
	// Simple case optimization.
	if (typeof content === 'string') {
		return content
	}
	if (content) {
		// Concatenate post paragraphs' text.
		let text = ''
		let softLimit = options.softLimit
		for (const block of content) {
			let blockText = getContentText(block, softLimit, {
				...options,
				attachments
			})
			if (blockText) {
				blockText = blockText.trim()
			}
			if (!blockText) {
				continue
			}
			if (text) {
				text += '\n\n'
			}
			text += blockText
			if (options.stopOnNewLine) {
				return text
			}
			if (softLimit !== undefined) {
				softLimit -= blockText.length - countOccurrences(blockText, '\n')
				if (softLimit <= 0) {
					break
				}
			}
		}
		if (text) {
			return text
		}
	}
	// If there're any attachments then fall back to attachment text.
	if (attachments) {
		for (const attachment of attachments) {
			if (getAttachmentText(attachment, options.messages)) {
				return getAttachmentText(attachment, options.messages)
			}
		}
		if (options.messages) {
			for (const attachment of attachments) {
				if (getAttachmentMessage(attachment, options.messages)) {
					return getAttachmentMessage(attachment, options.messages)
				}
			}
		}
	}
	return ''
}

export function getContentText(content, softLimit, options = {}) {
	if (typeof content === 'string') {
		return content
	}
	if (Array.isArray(content)) {
		let text = ''
		let i = 0
		while (i < content.length) {
			const part = content[i]
			if (part === '\n' && options.stopOnNewLine && text) {
				break
			}
			const isStandalonePostLink = content[i].type === 'post-link' &&
				(i === 0 || content[i - 1] === '\n') &&
				(i === content.length - 1 || content[i + 1] === '\n')
			let partText
			if (isStandalonePostLink && !(Array.isArray(part.content) && part.content[0].type === 'quote')) {
				// Ignore standalone post links without quote content.
				// (for example, "Hidden post" links or "Deleted post" links)
			} else {
				partText = getContentText(part, softLimit, options)
			}
			if (partText) {
				text += partText
				if (softLimit !== undefined) {
					softLimit -= partText.length - countOccurrences(partText, '\n')
					if (softLimit <= 0) {
						break
					}
				}
			} else {
				if (i + 1 < content.length) {
					// Skip the "new line" after the ignored post part.
					if (content[i + 1] === '\n') {
						i++
					}
				}
			}
			i++
		}
		// Some parts return empty text which means they're ignored
		// so there may be possibly some dangling "new line"s.
		// For example, if there was a quote in the beginning
		// and then some "new line"s and then some text
		// then such quote in the beginning would be ignored
		// resulting in dangling "new line"s.
		return text
			.replace(/^\n+/, '')
			.replace(/\n+$/, '')
	}
	const part = content
	const getContent = (content) => {
		if (content === undefined) {
			if (!part.content) {
				console.error(`No "content" is present for an inline-level paragraph part`)
				console.error(part)
			}
			content = part.content
		}
		return getContentText(content, softLimit, options)
	}
	switch (part.type) {
		case 'quote':
			if (part.source) {
				return `«${getContent()}» — ${part.source}`
			}
			return `«${getContent()}»`
		case 'spoiler':
			// https://www.w3schools.com/charsets/ref_utf_block.asp
			// ░ LIGHT SHADE
			// ▒ MEDIUM SHADE
			// ▓ DARK SHADE
			// █ FULL BLOCK
			// Also add "line break" characters
			// because otherwise in iOS Safari it would overflow.
			return '░\u200b'.repeat(getContent().length)
		case 'emoji':
			return `:${part.name}:`
		case 'post-link':
			if (options.skipPostQuotes || (part.quoteAutogenerated && options.skipAutogeneratedPostQuotes)) {
				return
			}
			if (Array.isArray(part.content)) {
				return part.content.map(getContent).join('\n')
			}
			return part.content
		case 'link':
			if (part.contentGenerated) {
				if (options.messages && options.messages.linkTo) {
					return `(${options.messages.linkTo.replace('{0}', getDomainName(part.url)).toLowerCase()})`
				}
				return getHumanReadableLinkAddress(part.url)
			}
			return part.content
		case 'code':
			if (!part.inline) {
				let code = getPostText(part.content, undefined, {
					stopOnNewLine: true
				})
				const newLineIndex = code.indexOf('\n')
				if (newLineIndex >= 0) {
					return code.slice(0, newLineIndex)
				}
				return code
			}
			return getContent()
		case 'attachment':
			if (options.skipAttachments) {
				return
			}
			const attachment = options.attachments.find(_ => _.id === part.attachmentId)
			if (!attachment) {
				return
			}
			const text = getAttachmentText(attachment, options.messages)
			if (text) {
				return text
			}
			if (options.skipUntitledAttachments) {
				return
			}
			if (options.messages) {
				return getAttachmentMessage(attachment, options.messages)
			}
			return
		default:
			return getContent()
	}
}

function countOccurrences(string, character) {
	let count = 0
	for (const char of string) {
		if (char === character) {
			count++
		}
	}
	return count
}