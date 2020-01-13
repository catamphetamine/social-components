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
 * @param  {object} post — Post having `content: any?` and `attachments: object[]`.
 * @param  {number} [options.softLimit]
 * @param  {object} [options.messages] — An object of shape `{ contentType: { audio: 'Audio', ... } }`.
 * @param  {boolean} [options.skipPostQuoteBlocks] — Skip all "block" (not "inline") post quotes.
 * @param  {boolean} [options.skipGeneratedPostQuoteBlocks] — Skip all autogenerated "block" (not "inline") post quotes. Is `true` by default.
 * @param  {boolean} [options.skipAttachments] — Skip attachments (embedded and non-embedded). Is `true` by default.
 * @param  {boolean} [options.skipNonEmbeddedAttachments] — Skip non-embedded attachments. Is `true` by default.
 * @param  {boolean} [options.skipUntitledAttachments] — Skip untitled attachments (embedded and non-embedded). Is `true` by default.
 * @param  {function} [options.onAttachment] — Is called every time an untitled attachment likely becomes part of the generated text. "Likely", because the text might get trimmed in such a way that the untitled attachment isn't part of it.
 * @param  {boolean} [options.trimCodeBlocksToFirstLine] — Trim code blocks to first line. Is `true` by default.
 * @param  {boolean} [options.stopOnNewLine] — If `true` then the function will stop on the first "new line" character of the generated text.
 * @param  {string} [options.openingQuote] — Opening quote character used to generate inline `post-link` quoted text content. Is `«` by default.
 * @param  {string} [options.closingQuote] — Closing quote character used to generate inline `post-link` quoted text content. Is `»` by default.
 * @return {string} [text]
 */
export default function getPostText({ content, attachments }, options = {}) {
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
	if (attachments && (options.skipAttachments === false) && (options.skipNonEmbeddedAttachments === false)) {
		const { messages } = options
		for (const attachment of attachments) {
			const text = getAttachmentText(attachment, messages && messages.contentType)
			if (text) {
				return text
			}
		}
		if (options.skipUntitledAttachments === false) {
			if (messages && messages.contentType) {
				for (const attachment of attachments) {
					const text = getAttachmentMessage(attachment, messages.contentType)
					if (text) {
						if (options.onAttachment) {
							options.onAttachment(attachment)
						}
						return text
					}
				}
			}
		}
	}
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
			const partText = getContentText(part, softLimit, {
				...options,
				isStandalone: (i === 0 || content[i - 1] === '\n') &&
					(i === content.length - 1 || content[i + 1] === '\n')
			})
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
			if (part.content) {
				content = part.content
			} else {
				console.error(`No "content" is present for an inline-level paragraph part`)
				console.error(part)
				return ''
			}
		}
		return getContentText(content, softLimit, options)
	}
	switch (part.type) {
		case 'quote':
			const openingQuote = options.openingQuote || '«'
			const closingQuote = options.closingQuote || '»'
			if (part.source) {
				return `${openingQuote}${getContent()}» — ${part.source}${closingQuote}`
			}
			return `${openingQuote}${getContent()}${closingQuote}`
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
			const hasQuotes = Array.isArray(part.content) && part.content[0].type === 'quote'
			const hasQuoteBlocks = hasQuotes && part.content[0].block
			const hasInlineQuotes = hasQuotes && !hasQuoteBlocks
			if (options.onPostLink) {
				options.onPostLink(part)
			}
			// Ignore standalone post links without quote content.
			// (for example, "Hidden post" links or "Deleted post" links)
			if (!hasQuotes && options.isStandalone) {
				return
			}
			if (options.skipPostQuoteBlocks && hasQuoteBlocks ||
				(options.skipGeneratedPostQuoteBlocks !== false) && hasQuoteBlocks && part.content[0].generated) {
				return
			}
			if (Array.isArray(part.content)) {
				let content = ''
				for (const subpart of part.content) {
					const text = getContent(subpart)
					if (text) {
						content += text
						if (text !== '\n') {
							if (softLimit !== undefined) {
								softLimit -= text.length
							}
						}
					}
				}
				return content
			}
			return part.content
		case 'link':
			if (part.contentGenerated) {
				const { messages } = options
				if (messages && messages.contentType && messages.contentType.linkTo) {
					return `(${messages.contentType.linkTo.replace('{0}', getDomainName(part.url)).toLowerCase()})`
				}
				return getHumanReadableLinkAddress(part.url)
			}
			return part.content
		case 'code':
			if (!part.inline) {
				let code = getContentText(part.content, softLimit, {
					stopOnNewLine: options.trimCodeBlocksToFirstLine !== false
				})
				if (options.trimCodeBlocksToFirstLine !== false) {
					const newLineIndex = code.indexOf('\n')
					if (newLineIndex >= 0) {
						return code.slice(0, newLineIndex)
					}
				}
				return code
			}
			return getContent()
		case 'attachment':
			if (options.skipAttachments !== false) {
				return
			}
			const attachment = options.attachments.find(_ => _.id === part.attachmentId)
			if (!attachment) {
				return
			}
			const { messages } = options
			const text = getAttachmentText(attachment, messages && messages.contentType)
			if (text) {
				return text
			}
			if (options.skipUntitledAttachments !== false) {
				return
			}
			if (messages && messages.contentType) {
				const text = getAttachmentMessage(attachment, messages.contentType)
				if (text) {
					if (options.onAttachment) {
						options.onAttachment(attachment)
					}
					return text
				}
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