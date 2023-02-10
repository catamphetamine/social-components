import getPostText from './getPostText.js'
import getEmbeddedAttachment from './getEmbeddedAttachment.js'
import trimText, { MAX_FIT_FACTOR } from './trimText.js'

const CHARACTERS_COUNT_PENALTY_FOR_LINE_BREAK = 15

/**
 * Returns post text: first tries without post quotes, then tries with post quotes (unless `skipPostQuoteBlocks: true` option is passed).
 * @param  {object} post
 * @param  {number} options.maxLength — See `maxLength` argument of `trimText()`.
 * @param  {function} [options.getCharactersCountPenaltyForLineBreak] — Returns characters count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by characters count. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted.
 * @param  {number} [options.minFitFactor] — See `minFitFactor` option of `trimText()`.
 * @param  {number} [options.maxFitFactor] — See `maxFitFactor` option of `trimText()`.
 * @param  {string} [options.trimMarkEndOfLine] — "Trim mark" when trimming at the end of a line. Is " …" by default. See `trimMarkEndOfLine` option of `trimText()`.
 * @param  {string} [options.trimMarkEndOfSentence] — "Trim mark" when trimming at the end of a sentence. Is " …" by default. See `trimMarkEndOfSentence` option of `trimText()`.
 * @param  {string} [options.trimMarkEndOfWord] — "Trim mark" when trimming at the end of a word. Is " …" by default. See `trimMarkEndOfWord` option of `trimText()`.
 * @param  {string} [options.trimMarkAbrupt] — "Trim mark" when trimming mid-word. Is "…" by default. See `trimMarkAbrupt` option of `trimText()`.
 * @param  {bool} [options.skipPostQuoteBlocks] — Set to `true` to skip post quotes. Post quotes are skipped by default, unless no quote has been generated, in which case the function is re-run with post quotes included (unless instructed otherwise).
 * @param  {function} [options.onUntitledAttachment] — If set, this function will be called with an untitled attachment as an argument in cases when the resulting post quote has to quote such untitled attachment, resulting in something generic like "Picture" or "Video": in such cases, the `attachment` could be displayed instead of such generic label.
 * @return {string} [text]
 */
export default function generatePostQuote(post, _options) {
	const {
		title,
		content,
		attachments
	} = post
	const {
		maxLength,
		minFitFactor,
		maxFitFactor,
		skipPostQuoteBlocks,
		onUntitledAttachment,
		getCharactersCountPenaltyForLineBreak,
		trimMarkEndOfLine,
		trimMarkEndOfSentence,
		trimMarkEndOfWord,
		trimMarkAbrupt,
		// cache,
		...rest
	} = _options
	const getPostTextOptions = {
		...rest,
		// A couple of extra characters are added to "soft limit",
		// so that `trimText()` appends a proper "trim mark"
		// (the one for end of sentence, end of word, or just a generic one).
		// One character is for "end of sentence" punctuation (like '.' or '?'),
		// and the other one is for spacing after it, so that `trimText()`
		// could detect "end of sentence" at max length.
		softLimit: maxLength * (maxFitFactor === undefined ? MAX_FIT_FACTOR : maxFitFactor) + 2
	}
	let text
	// If `cache` was to be implemented, then
	// `post._text` and `post._textMaxLength`
	// would have to be reset after `loadResourceLinks()`,
	// and also after an attachment spoiler has been revealed.
	// Also, `onPostLink()` wouldn't get triggered in such case,
	// which would result in incorrect behavior of
	// `canGeneratePostQuoteIgnoringNestedPostQuotes()`.
	// if (cache && post._textMaxLength !== undefined && maxLength <= post._textMaxLength) {
	// 	text = post._text
	// } else {
		// First generated post text skipping all quote blocks and attachments.
		text = getPostText(post, {
			...getPostTextOptions,
			skipPostQuoteBlocks: true,
			skipAttachments: true
		})
		// If no text was generated with the strict conditions,
		// start relaxing the conditions until some text is generated.
		// Start with not skipping attachments having a title.
		if (!text) {
			text = getPostText(post, {
				...getPostTextOptions,
				skipPostQuoteBlocks: true,
				skipAttachments: false,
				skipUntitledAttachments: true,
				skipNonEmbeddedAttachments: false
			})
		}
		// // Then continue with not skipping non-generated post quotes.
		// if (!text) {
		// 	text = getPostText(post, {
		// 		...getPostTextOptions,
		// 		skipGeneratedPostQuoteBlocks: true,
		// 		skipUntitledAttachments: true
		// 	})
		// }
		// Add post title to the text.
		text = addTitle(text, title)
		// If no text was generated, then continue with
		// not skipping untitled attachments.
		if (!text) {
			text = getPostText(post, {
				...getPostTextOptions,
				skipPostQuoteBlocks: true,
				skipAttachments: false,
				skipUntitledAttachments: false,
				skipNonEmbeddedAttachments: false,
				onAttachment: onUntitledAttachment
			})
		}
		// If no text was generated, then continue with not skipping
		// post quote blocks (unless explicitly instructed otherwise).
		if (!text) {
			if (!skipPostQuoteBlocks) {
				text = getPostText(post, getPostTextOptions)
				// If no text was generated, then continue with
				// not skipping autogenerated post quote blocks.
				if (!text) {
					text = getPostText(post, {
						...getPostTextOptions,
						skipGeneratedPostQuoteBlocks: false
					})
				}
			}
		}
	// 	if (cache) {
	// 		post._text = text
	// 		post._textMaxLength = maxLength
	// 	}
	// }
	if (text) {
		// Trim the text to `maxLength` (with "fit factors").
		text = trimText(
			text,
			maxLength,
			{
				getCharactersCountPenaltyForLineBreak: getCharactersCountPenaltyForLineBreak || (() => CHARACTERS_COUNT_PENALTY_FOR_LINE_BREAK),
				minFitFactor,
				maxFitFactor,
				trimMarkEndOfLine,
				trimMarkEndOfSentence,
				trimMarkEndOfWord,
				trimMarkAbrupt
			}
		)
		// Compact inter-paragraph margins into just "new line" characters.
		// This is done after `trimText()` because otherwise it could
		// interfere with the `text` length before trimming, and that
		// would interfere with the `softLimit` option of `getPostText()`
		// which is set in such a way so that "soft-limited" `text`'s length
		// is a couple of characters more than `maxLength * maxFitFactor`,
		// so that `trimText()` inserts the correct "trim mark".
		if (text) {
			return text.replace(/\n\n+/g, '\n')
		}
	}
}

function addTitle(text, title) {
	if (!title) {
		return text
	}
	if (text) {
		return title + '\n\n' + text
	} else {
		return title
	}
}

export function canGeneratePostQuoteIgnoringNestedPostQuotes(post, options) {
	// If the `post` contains inline `post-link`s, then
	// `getPostText({ maxLength })` will include those
	// linked posts' `content`, so it has to be parsed
	// before generating this `post`'s quote.
	let encounteredInlinePostLink
	const text = generatePostQuote(post, {
		...options,
		// `canGeneratePostQuoteIgnoringNestedPostQuotes()`
		// skips all `post-link` block quotes entirely
		// and returns `false` whenever it encounters an
		// inline `post-link` quote. The whole point of
		// `canGeneratePostQuoteIgnoringNestedPostQuotes()`
		// is that it runs before `post-link`s' `content` is even parsed.
		// The only case when a `post-link` has parsed `content`
		// is when those're quotes that have been manually entered
		// by the comment author, but those aren't included in the
		// post quote anyway, because `skipPostQuoteBlocks: false`
		// is passed internally to `generatePostQuote()`.
		// So `post-link`s are ignored entirely by this function,
		// and their `content` has no influence on this function's outcome.
		skipPostQuoteBlocks: true,
		onPostLink: (postLink) => {
			// `postLink._block` flag is set in `setInReplyToQuote()`.
			// `postLink.content[0].block` can't be used there
			// because `postLink.content` is not yet generated
			// because the linked post's `content` hasn't been parsed yet.
			if (!postLink._block) {
				encounteredInlinePostLink = true
			}
		}
	})
	// If there's an inline `post-link` quote that's gonna be part of
	// the resulting post quote generated with the the `maxLength`,
	// then the linked `post`'s `content` has to be parsed first.
	if (encounteredInlinePostLink) {
		return false
	}
	// The `post` is supposed to have some `content`:
	// the calling function checks that before calling
	// this function. Otherwise, there'd be no need
	// to call this function.
	// If the `post` has `content`, but its `text` is empty,
	// then the `content` is assumed to only contain autogenerated
	// block `post-link` quotes, which have all been skipped.
	// If that's the case, then it means that the quoted posts'
	// `content` should be parsed first.
	return text ? true : false
}