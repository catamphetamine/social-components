import getPostText from './getPostText'
import trimText from './trimText'

/**
 * Returns post text: first tries without post quotes, then tries with post quotes (unless `skipPostQuoteBlocks: true` option is passed).
 * @param  {object} post
 * @param  {bool} options.skipPostQuoteBlocks — Set to `true` to skip post quotes. Post quotes are skipped on first run, but not on second run (if the first run returned no text).
 * @return {string} [text]
 */
export default function generatePostQuote({ content, attachments }, _options) {
	const {
		maxLength,
		fitFactor,
		countNewLines,
		skipPostQuoteBlocks,
		...rest
	} = _options
	const getPostTextOptions = {
		...rest,
		softLimit: maxLength
	}
	let text = getPostText({ content, attachments }, {
		...getPostTextOptions,
		skipPostQuoteBlocks: true
	})
	// If the generated post preview is empty
	// then loosen the filters and include post quotes.
	if (!text && !skipPostQuoteBlocks) {
		text = getPostText({ content, attachments }, getPostTextOptions)
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
	// If a post contains inline post links, then `getPostText()`
	// will include those linked posts' content, so they should
	// be parsed too.
	let encounteredInlinePostLink
	const text = generatePostQuote(post, {
		...options,
		// `maxLength: 1` and `fitFactor: 0` were for cases when inline `post-link`s didn't exist.
		// Now that inline `post-link`s do exist, `maxLength` and `fitFactor` are passed in `options`.
		// maxLength: 1,
		// fitFactor: 0,
		skipPostQuoteBlocks: true,
		onPostLink: (postLink) => {
			// `postLink._block` flag is set in `setInReplyToQuote()`.
			// `postLink.content[0].block` can't be used there
			// because `postLink.content` is not yet generated.
			if (!postLink._block) {
				encounteredInlinePostLink = true
			}
		}
	})
	if (encounteredInlinePostLink) {
		return false
	}
	return text ? true : false
}