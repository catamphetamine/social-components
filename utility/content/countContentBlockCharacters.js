import countIfNonTextPostBlockFits from './countIfNonTextPostBlockFits.js'
import countTextBlockCharacters from './countTextBlockCharacters.js'

/**
 * Counts characters in a post "block".
 * Not in a post but rather in one of its "blocks".
 * @param  {any} block
 * @param  {string} mode — One of: points, characters, lines.
 * @param  {boolean} [options.minimizeGeneratedPostLinkBlockQuotes] — Set to `true` to indicate that post links with generated block quotes are initially minimized when rendered: this results in skipping counting those post links' content characters.
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
