import forEachFollowingQuote from './forEachFollowingQuote.js'

/**
 * Combines `{ type: 'quote' }` objects on consequtive lines
 * into a single `{ type: 'quote' }` object with "\n"s inside.
 * @param  {any} content
 */
export default function combineQuotes(content) {
	if (!content) {
		return
	}
	if (!Array.isArray(content)) {
		return
	}
	for (const paragraph of content) {
		if (Array.isArray(paragraph)) {
			_combineQuotes(paragraph)
		}
	}
}

function _combineQuotes(content) {
	let i = 0
	while (i < content.length) {
		if (content[i].type === 'quote') {
			// The combined quote must be placed on a new line.
			if (i === 0 || content[i - 1] === '\n') {
				// `kohlchan.net` and `8ch.net` have regular (green) quotes
				// and "inverse" (red) quotes.
				let canCombineQuotes = true
				let combinedQuotesCount = 0
				forEachFollowingQuote(content, i, (quote, _i) => {
					// Skip the starting quote.
					if (_i === i) {
						return
					}
					if (!canCombineQuotes) {
						return
					}
					// `kohlchan.net` and `8ch.net` have regular (green) quotes
					// and "inverse" (red) quotes.
					// Can only combine quotes of same "kind".
					if (quote.kind !== content[i].kind) {
						canCombineQuotes = false
						return
					}
					// Convert the starting quote to array.
					if (!Array.isArray(content[i].content)) {
						content[i].content = [content[i].content]
					}
					// Add "\n".
					content[i].content.push('\n')
					// Add the following quote.
					if (Array.isArray(quote.content)) {
						content[i].content = content[i].content.concat(quote.content)
					} else {
						content[i].content.push(quote.content)
					}
					combinedQuotesCount++
				})
				if (combinedQuotesCount > 0) {
					content.splice(i + 1, combinedQuotesCount * 2)
				}
			}
		}
		i++
	}
}