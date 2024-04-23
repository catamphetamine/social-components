import countIfNonTextPostBlockFits from './countIfNonTextPostBlockFits.js'
import countTextBlockCharacters from './countTextBlockCharacters.js'

/**
 * Counts characters in a post "block".
 * Not in a post but rather in one of its "blocks".
 * @param  {any} block
 * @param  {string} mode — One of: points, characters, lines.
 * @param  {boolean} [options.minimizeGeneratedPostLinkBlockQuotes] — One can pass `true` to indicate that auto-generated quotes are minimized by default until the user expands them manually. This would mean that auto-generated quotes shouldn't be accounted for when calculating the total length of a comment when creating a shorter "preview" for it in case it exceeds the maxum preferred length.
 * @return {number}
 */
export default function countContentBlockCharacters(block, mode, { minimizeGeneratedPostLinkBlockQuotes } = {}) {
	if (Array.isArray(block) || typeof block === 'string') {
		return countTextBlockCharacters(block, mode, { minimizeGeneratedPostLinkBlockQuotes })
	} else {
		if (mode === 'points') {
			return countNonTextPostBlockCharacters(block, post)
		} else if (mode === 'lines') {
			return countNonTextPostBlockCharacters(block, post)
		}
		return countNonTextPostBlockCharacters(block, post)
	}
}


/**
 * Counts characters in a post "block".
 * Not in a post but rather in one of its "blocks".
 * The block must be a non-"text" one:
 * embedded image, embedded video, list, quote, etc.
 * @param  {any} block
 * @param  {string} mode — One of: points, characters, lines.
 * @return {number}
 */
function countNonTextPostBlockCharacters(block, post) {
	let totalCharacterCount = 0
	countIfNonTextPostBlockFits(block, post, (characterCount) => {
		totalCharacterCount += characterCount
	})
}
