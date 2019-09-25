import getPostText from './getPostText'
import trimText from './trimText'

export default function getPostSummary(content, attachments, {
	messages,
	maxLength,
	stopOnNewLine,
	countNewLines,
	fitFactor
}) {
	let text = getPostText(content, attachments, {
		excludePostQuotes: true,
		excludeCodeBlocks: true,
		softLimit: maxLength,
		stopOnNewLine,
		// `messages` are optional.
		messages
	})
	// If the generated post preview is empty
	// then loosen the filters and include quotes.
	// Code blocks are replaced with "(code)".
	if (!text) {
		text = getPostText(content, attachments, {
			excludePostQuotes: false,
			excludeCodeBlocks: true,
			softLimit: maxLength,
			stopOnNewLine,
			// `messages` are optional.
			messages
		})
		// If the generated post preview is empty
		// then loosen the filters and include quotes.
		// Code blocks are always replaced with "(code)".
		if (!text) {
			text = getPostText(content, attachments, {
				excludePostQuotes: false,
				excludeCodeBlocks: false,
				softLimit: maxLength,
				stopOnNewLine,
				// `messages` are optional.
				messages
			})
		}
	}
	if (text) {
		// Return the quoted post text abstract.
		// Compacts multiple paragraphs into multiple lines.
		return trimText(
			text.replace(/\n\n+/g, '\n'),
			maxLength,
			{
				countNewLines,
				fitFactor
			}
		)
	}
}