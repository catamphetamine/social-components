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
		skipPostQuotes: true,
		// skipCodeBlocks: true,
		softLimit: maxLength,
		stopOnNewLine,
		// `messages` are optional.
		messages
	})
	// If the generated post preview is empty
	// then loosen the filters and include post quotes.
	if (!text) {
		text = getPostText(content, attachments, {
			skipPostQuotes: false,
			// skipCodeBlocks: true,
			softLimit: maxLength,
			stopOnNewLine,
			// `messages` are optional.
			messages
		})
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