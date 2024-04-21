/**
 * Censors words matching the supplied filters (compiled word patterns).
 * @param  {string} text
 * @param  {object[]} filters
 * @return {(string|object)[]} An array of strings and objects of shape `{ type: 'spoiler', censored: true, content: string }`.
 */
export default function censorWords(text, filters, { createCensoredTextElement }) {
	return censor(text, filters, undefined, createCensoredTextElement) || text
}

function censor(text, filters, filterIndex = 0, createCensoredTextElement) {
	if (filterIndex === filters.length) {
		return
	}
	const filter = filters[filterIndex]
	const match = filter.regexp.exec(text)
	if (!match || !match[0]) {
		return censor(text, filters, filterIndex + 1, createCensoredTextElement)
	}
	let startIndex = match.index
	let matchedText = match[0]
	let endIndex = startIndex + matchedText.length
	if (filter.includesWordStart) {
		startIndex++
		matchedText = matchedText.slice(1)
	}
	if (filter.includesWordEnd) {
		endIndex--
		matchedText = matchedText.slice(0, matchedText.length - 1)
	}
	let result
	const preText = text.slice(0, startIndex)
	const preTextAfterIgnore = preText ? censor(preText, filters, filterIndex, createCensoredTextElement) : undefined
	if (preTextAfterIgnore) {
		result = preTextAfterIgnore
	} else if (preText) {
		result = [preText]
	} else {
		result = []
	}
	result.push(createCensoredTextElement(matchedText))
	const postText = text.slice(startIndex + matchedText.length)
	const postTextAfterIgnore = postText ? censor(postText, filters, filterIndex, createCensoredTextElement) : undefined
	if (postTextAfterIgnore) {
		result = result.concat(postTextAfterIgnore)
	} else if (postText) {
		result.push(postText)
	}
	return result
}