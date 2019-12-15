import getPostText from './getPostText'
import trimText from './trimText'

/**
 * Returns post text: first tries without post quotes, then tries with post quotes (unless `skipPostQuotes: true` option is passed).
 * @param  {object} post
 * @param  {bool} options.skipPostQuotes — Set to `true` to skip post quotes. Post quotes are skipped on first run, but not on second run (if the first run returned no text).
 * @return {string} [text]
 */
export default function generatePostQuote({ content, attachments }, {
	messages,
	maxLength,
	stopOnNewLine,
	countNewLines,
	skipPostQuotes,
	fitFactor
}) {
	const options = {
		softLimit: maxLength,
		stopOnNewLine,
		// `messages` are optional.
		messages
	}
	let text = getPostText({ content, attachments }, {
		...options,
		skipPostQuotes: true
	})
	// If the generated post preview is empty
	// then loosen the filters and include post quotes.
	if (!text && !skipPostQuotes) {
		text = getPostText({ content, attachments }, options)
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

export function canGeneratePostQuoteIgnoringNestedPostQuotes(post, options) {
	return generatePostQuote(post, {
		maxLength: 1,
		fitFactor: 0,
		messages: options && options.messages,
		skipPostQuotes: true
	}) ? true : false
}