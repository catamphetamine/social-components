import isPostLinkBlockQuote from './isPostLinkBlockQuote.js'
import isPostLinkGeneratedQuote from './isPostLinkGeneratedQuote.js'

// Is used to compensate for long posts with short lines.
// Example:
// "Ratings:
//  8/10
//  9/10
//  ..."
export const AVERAGE_LINE_CHARACTERS = 80

export const NEW_LINE_COST = 30

/**
 * Counts characters in a post "block".
 * Not in a post but rather in one of its "blocks".
 * The block must be a "text" one.
 * @param  {any} block
 * @param  {string} mode — One of: points, characters, lines.
 * @param  {boolean} [options.minimizeGeneratedPostLinkBlockQuotes] — Set to `true` to indicate that post links with generated block quotes are initially minimized when rendered: this results in skipping counting those post links' content characters.
 * @return {number}
 */
export default function countTextBlockCharacters(block, mode, { minimizeGeneratedPostLinkBlockQuotes } = {}) {
	let lineCharacterCount = 0
	const onNewLine = () => {
		const lineLength = lineCharacterCount
		lineCharacterCount = 0
		return lineLength
	}
	const onAddLineCharacters = (count) => lineCharacterCount += count
	let result = countCharacters(block, mode, onNewLine, onAddLineCharacters, minimizeGeneratedPostLinkBlockQuotes)
	if (mode === 'lines') {
		return Math.ceil(result / AVERAGE_LINE_CHARACTERS)
	}
	return result
}

function countCharacters(content, mode, onNewLine, onAddLineCharacters, minimizeGeneratedPostLinkBlockQuotes) {
	if (Array.isArray(content)) {
		let count = 0
		for (const part of content) {
			// Calculate characters count.
			let characterCount = countCharacters(part, mode, onNewLine, onAddLineCharacters, minimizeGeneratedPostLinkBlockQuotes)
			// Compensate for short lines of text:
			// add extra characters count for short lines of text
			// to emulate their length being at least `AVERAGE_LINE_CHARACTERS`.
			if (part === '\n') {
				const charactersFromLineStart = onNewLine()
				if (mode === 'points' || mode === 'lines') {
					if (charactersFromLineStart < AVERAGE_LINE_CHARACTERS) {
						characterCount += AVERAGE_LINE_CHARACTERS - charactersFromLineStart
					}
				}
			}
			count += characterCount
		}
		return count
	} else if (typeof content === 'string') {
		if (content === '\n') {
			if (mode === 'points') {
				return NEW_LINE_COST
			} else if (mode === 'characters') {
				return 0
			} else if (mode === 'lines') {
				return AVERAGE_LINE_CHARACTERS
			}
		}
		if (mode === 'points' || mode === 'lines') {
			onAddLineCharacters(content.length)
		}
		return content.length
	} else if (content.content) {
		if (content.type === 'post-link') {
			if (isPostLinkBlockQuote(content)) {
				if (minimizeGeneratedPostLinkBlockQuotes && isPostLinkGeneratedQuote(content)) {
					return 0
				}
				// Doesn't handle `content.attachments` here.
				// If a post link has `.attachments[]` then `webapp-frontend`
				// shows those attachments' thumbnails as the post link content.
			}
		}
		return countCharacters(content.content, mode, onNewLine, onAddLineCharacters, minimizeGeneratedPostLinkBlockQuotes)
	} else if (content.type === 'emoji') {
		return 0
	} else {
		console.error(`No "content" is present for an inline-level paragraph part:`)
		console.error(content)
		return 0
	}
}