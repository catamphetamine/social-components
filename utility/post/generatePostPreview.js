// import trimText from './trimText'
import { trimInlineContentOnSide } from '../content/trimInlineContent.js'
import findContentPart from '../content/findContentPart.js'
import findLastSentenceEnd from '../text/findLastSentenceEnd.js'
import splitContent from '../content/splitContent.js'
import countCharacters, {
	AVERAGE_LINE_CHARACTERS,
	NEW_LINE_COST
} from '../content/countTextBlockCharacters.js'
import countIfNonTextPostBlockFits from '../content/countIfNonTextPostBlockFits.js'
import getContentBlocks from '../content/getContentBlocks.js'

const NEW_PARAGRAPH_COST = 60

const MIN_FIT_FACTOR = 0.75
const MAX_FIT_FACTOR = 1.2

const TEXT_TRIM_MARK_END_OF_WORD = '…'
const TEXT_TRIM_MARK_ABRUPT = '…'

/**
 * Generates a shortened "preview" of a post's `content`.
 * @param  {Post} post.
 * @param  {number} options.maxLength — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
 * @param  {number} [options.minFitFactor] — `maxLength` lower limit extension. See `minFitFactor` option of `trimText()`.
 * @param  {number} [options.maxFitFactor] — `maxLength` upper limit extension. See `maxFitFactor` option of `trimText()`.
 * @param  {string} [options.textTrimMarkEndOfWord] — Appends this "trim mark" when text has to be trimmed after word end (but not after sentence end). Is "…" by default.
 * @param  {string} [options.textTrimMarkAbrupt] — Appends this "trim mark" when text has to be trimmed mid-word. Is "…" by default.
 * @param  {boolean} [options.minimizeGeneratedPostLinkBlockQuotes] — Set to `true` to indicate that post links with generated block quotes are initially minimized when rendered: this results in skipping counting those post links' content characters when generating post preview.
 * @return {Content} [previewContent] Preview content. If `content` was `undefined` then `previewContent` is too. Otherwise, `previewContent` isn't `undefined`. If the `content` fits entirely then the preview content will be (deeply) equal to it. Otherwise, preview content will be a shortened version of `content` with a `{ type: 'read-more' }` marker somewhere in the end.
 */
export default function generatePostPreview({ content, attachments }, options) {
	if (!content) {
		return
	}
	return new PreviewGenerator(content, attachments, options).generate()
}

class PreviewGenerator {
	preview = []

	characterCount = 0
	characterPoints = 0

	// This is used to decide whether to trim at
	// sentence end mid-paragraph or at paragraph end.
	blockLevelTrimCharacterCount = 0
	blockLevelTrimCharacterPoints = 0

	/**
	 * @param {Content} content — Post `content`. Can't be `undefined`.
	 * @param {object[]} [attachments] — If the `content` has any embedded attachments, `attachments` list must be passed.
	 * @param {number} options.maxLength — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
   * @param  {number} [options.minFitFactor] — `maxLength` lower limit extension. See `minFitFactor` option of `trimText()`.
   * @param  {number} [options.maxFitFactor] — `maxLength` upper limit extension. See `maxFitFactor` option of `trimText()`.
	 */
	constructor(content, attachments, options) {
		this.content = content
		this.attachments = attachments
		this.options = options
	}

	generate() {
		let i = 0
		while (i < this.content.length) {
			const block = this.content[i]
			// If the `block` fits, then `trimmedBlock` is gonna be `block`.
			// If the `block` doesn't fit, then `trimmedBlock` can be a
			// trimmed version of the `block`.
			// If the `block` doesn't fit, and no trimmed version of it
			// could be generated, then `trimmedBlock` is `undefined`.
			let trimmedBlock
			if (typeof block === 'string') {
				if (block === '\n') {
					if (this.willOverflow(NEW_LINE_COST)) {
						// Whitespace serves the purpose of making it
						// move `{ type: "read-more" }` to a new paragraph.
						trimmedBlock = ' '
					} else {
						trimmedBlock = block
					}
					this.characterPoints += NEW_LINE_COST
					// Compensate for short lines of text (in this case: empty line).
					this.characterPoints += AVERAGE_LINE_CHARACTERS
				} else {
					// Could simply do `block = [block]` here,
					// but since this piece of code is already written,
					// why not use it. Maybe it does something special. Maybe not.
					const points = this.countCharacterPoints(block)
					const characters = this.countCharacters(block)
					// See if this text fits entirely.
					if (this.countIfFits(points, characters, 1)) {
						trimmedBlock = block
						// Compensate for short lines of text.
						if (characters < AVERAGE_LINE_CHARACTERS) {
							this.characterPoints += AVERAGE_LINE_CHARACTERS - characters
						}
					} else {
						// See if this text can be discarded.
						if (!this.willTrimLongEnoughAt(this.blockLevelTrimCharacterCount)) {
							// If this block can't be discarded, then trim it somehow.
							// First with a smaller "fit factor".
							trimmedBlock = this.trimTextContentPreferrable(block, 0) ||
								this.trimTextContentPreferrable(block, 1)
							if (!trimmedBlock) {
								// Then with a larger "fit factor".
								// First see if it fits entirely.
								if (this.countIfFits(points, characters, 2)) {
									trimmedBlock = block
									// Compensate for short lines of text.
									if (characters < AVERAGE_LINE_CHARACTERS) {
										this.characterPoints += AVERAGE_LINE_CHARACTERS - characters
									}
								} else {
									// If it doesn't fit entirely then trim it somehow.
									trimmedBlock = this.trimTextContentPreferrable(block, 2) ||
										this.trimTextContentFallback(block) ||
										this.trimTextContentAsIs(block)
								}
							}
						}
					}
				}
			}
			else if (Array.isArray(block)) {
				const points = this.countCharacterPoints(block)
				const characters = this.countCharacters(block)
				// See if this paragraph fits entirely.
				if (this.countIfFits(points, characters, 1)) {
					trimmedBlock = block
					// Compensate for short lines of text.
					if (characters < AVERAGE_LINE_CHARACTERS) {
						this.characterPoints += AVERAGE_LINE_CHARACTERS - characters
					}
				} else {
					// See if this paragraph can be discarded.
					if (!this.willTrimLongEnoughAt(this.blockLevelTrimCharacterCount)) {
						// If it can't be discarded then trim it somehow.
						// First with a smaller "fit factor".
						// Trimming at "\n" leaves the "\n" at the end so that
						// later it detects a "new line" trim point and appends
						// `{ type: 'read-more' }` as a block-level part.
						trimmedBlock = this.trimTextContentAtNewLine(block, 0) ||
							this.trimTextContentAtNewLine(block, 1) ||
							this.trimTextContentPreferrable(block, 0) ||
							this.trimTextContentPreferrable(block, 1)
						if (!trimmedBlock) {
							// Then with a larger "fit factor".
							// See if this paragraph fits entirely.
							if (this.countIfFits(points, characters, 2)) {
								trimmedBlock = block
								// Compensate for short lines of text.
								if (characters < AVERAGE_LINE_CHARACTERS) {
									this.characterPoints += AVERAGE_LINE_CHARACTERS - characters
								}
							} else {
								// If it doesn't fit entirely then trim it somehow.
								// Trimming at "\n" leaves the "\n" at the end so that
								// later it detects a "new line" trim point and appends
								// `{ type: 'read-more' }` as a block-level part.
								trimmedBlock = this.trimTextContentAtNewLine(block, 2) ||
									this.trimTextContentPreferrable(block, 2) ||
									this.trimTextContentFallback(block) ||
									this.trimTextContentAsIs(block)
							}
						}
					}
				}
			} else {
				// Returns `true` if the `block` fits entirely.
				// Returns a shortened `block` if the `block` fits partially (for example, a `list`).
				// Returns nothing if the `block` doesn't fit.
				const result = countIfNonTextPostBlockFits(block, this.attachments, this.countIfFits)
				if (result) {
					if (result === true) {
						// The `block` fits entirely.
						trimmedBlock = block
					} else {
						// `result` is a shortened `block` (for example, a shortened `list`).
						trimmedBlock = result
					}
				}
			}
			if (trimmedBlock) {
				// Append the possibly trimmed version of the `block` to the `preview`.
				this.preview.push(trimmedBlock)
			}
			const blockFitsWhenTrimmed = trimmedBlock && trimmedBlock !== block
			const blockFitsEntirely = trimmedBlock === block
			let blockDoesNotFit = !trimmedBlock
			let hasMoreBlocks = i + 1 < this.content.length
			const shouldTrimContent =
				blockFitsWhenTrimmed ||
				blockDoesNotFit ||
				// The `block` could have fit with a "fit factor", but not fit if the
				// `maxLength` limit was "strict". In such case, can already trim here,
				// because it already "makes sense" to do so: at this point it is known,
				// that it is gonna trim one way or another, assuming there's more content left.
				(blockFitsEntirely && this.characterPoints > this.options.maxLength)
			if (shouldTrimContent) {
				if (this.entireContentFitsWithinFitFactor(i)) {
					// If the rest content doesn't exceed the threshold
					// (with a "fit factor") then don't generate a preview
					// and just show the full content.
					return
				}
			}
			// If trim point reached.
			if (shouldTrimContent) {
				// A preview shouldn't be empty: in such case, show at least
				// the first content block, even if it will be shown non-trimmed.
				// This could theoretically be the case with a really low `maxLength`
				// and some kind of an attachment that has a really big "character points"
				// equivalent.
				if (this.preview.length === 0) {
					this.preview.push(getContentBlocks(this.content)[0])
					blockDoesNotFit = false
					hasMoreBlocks = this.content.length > 1
				}
				// Currently if a block is a string, it's not converted to
				// an array of that string. But for appending the `read-more` button,
				// the `trimmedBlock` should be "normalized", in order for the
				// `read-more` button to be added as an inline one rather than a
				// block-level one, as a separate block.
				if (typeof trimmedBlock === 'string') {
					// "Normalize" `trimmedBlock`.
					trimmedBlock = [trimmedBlock]
				}
				if (blockFitsWhenTrimmed || hasMoreBlocks || blockDoesNotFit) {
					addReadMoreButton(this.preview, blockFitsWhenTrimmed ? trimmedBlock : undefined)
				}
				return this.preview
			}
			this.characterPoints += NEW_PARAGRAPH_COST
			this.blockLevelTrimCharacterCount = this.characterCount
			this.blockLevelTrimCharacterPoints = this.characterPoints
			i++
		}
	}

	/**
	 * Checks if the entire post content fits within the `maxLength`
	 * with "fit factor".
	 * @param  {number} i — The current block index. Is passed just as a minor optimization, so that it doesn't have to re-calculate all previoulsy processed blocks' "character points".
	 * @return {boolean}
	 */
	entireContentFitsWithinFitFactor(i) {
		// See if the rest content exceeds the threshold.
		let points = this.blockLevelTrimCharacterPoints
		// `block` could be a `string` which means that
		// `.indexOf(block)` could confuse two identical string blocks.
		// let i = this.content.indexOf(block)
		const countIfFits = (count) => {
			if (typeof count !== 'number') {
				count = this.countCharacterPoints(count)
			}
			if (!this.doesExceedThreshold(points + count)) {
				points += count
				return true
			}
		}
		// Iterate over the rest of the content blocks.
		while (i < this.content.length) {
			const block = this.content[i]
			if (typeof block === 'string' || Array.isArray(block)) {
				points += this.countCharacterPoints(block)
				if (this.doesExceedThreshold(points)) {
					return false
				}
			} else {
				// Returns `true` if the `block` fits entirely.
				// Returns a shortened `block` if the `block` fits partially (for example, a `list`).
				// Returns nothing if the `block` doesn't fit.
				const result = countIfNonTextPostBlockFits(block, this.attachments, this.countIfFits)
				if (result !== true) {
					return false
				}
				// Partial fit case is ignored here.
			}
			points += NEW_PARAGRAPH_COST
			i++
		}
		return true
	}

	doesExceedThreshold(points) {
		return points > this.characterPoints * this.getMaxFitFactor()
	}

	getMinFitFactor() {
		return this.options.minFitFactor === undefined ? MIN_FIT_FACTOR : this.options.minFitFactor
	}

	getMaxFitFactor() {
		return this.options.maxFitFactor === undefined ? MAX_FIT_FACTOR : this.options.maxFitFactor
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to discard current paragraph.
	//
	// It would be more preferable to use "characters left" instead of "character points left"
	// but calculating "characters left" in context of a non-fitting block is extra computation
	// which is chosen to be avoided here for simplicity.
	//
	willTrimLongEnoughAt(characterCount) {
		return characterCount > this.getMinFitFactor() * (this.characterCount + this.getCharacterPointsLeft())
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to trim in the middle of current paragraph.
	//
	willTrimLongEnoughAfter(estimatedCharacterCount) {
		return this.willTrimLongEnoughAt(this.characterCount + estimatedCharacterCount)
	}

	getTextTrimMarkEndOfWord() {
		const { textTrimMarkEndOfWord } = this.options
		return textTrimMarkEndOfWord === undefined ? TEXT_TRIM_MARK_END_OF_WORD : textTrimMarkEndOfWord
	}

	getTextTrimMarkAbrupt() {
		const { textTrimMarkAbrupt } = this.options
		return textTrimMarkAbrupt === undefined ? TEXT_TRIM_MARK_ABRUPT : textTrimMarkAbrupt
	}

	countCharacters(content) {
		return countCharacters(content, 'characters', {
			minimizeGeneratedPostLinkBlockQuotes: this.options.minimizeGeneratedPostLinkBlockQuotes
		})
	}

	countCharacterPoints(content) {
		return countCharacters(content, 'points', {
			minimizeGeneratedPostLinkBlockQuotes: this.options.minimizeGeneratedPostLinkBlockQuotes
		})
	}

	getCharacterPointsLeft(fitFactorEffect) {
		return this.withMaxFitFactor(this.options.maxLength, fitFactorEffect) - this.characterPoints
	}

	countIn(content, arg2) {
		if (typeof content === 'number') {
			this.characterPoints += content
			this.characterCount += arg2
		} else {
			this.characterPoints += this.countCharacterPoints(content)
			this.characterCount += this.countCharacters(content)
		}
	}

	willOverflow(points, fitFactorEffect) {
		return this.characterPoints + points > this.withMaxFitFactor(this.options.maxLength, fitFactorEffect)
	}

	withMaxFitFactor(points, fitFactorEffect = 0) {
		if (fitFactorEffect) {
			return Math.floor(points * (1 + fitFactorEffect * (this.getMaxFitFactor() - 1)))
		}
		return points
	}

	countIfFits = (content, fitFactorEffect, arg3) => {
		if (typeof content === 'number') {
			const points = content
			const characters = fitFactorEffect
			fitFactorEffect = arg3
			if (this.willOverflow(points, fitFactorEffect)) {
				return
			}
			this.characterCount += characters
			this.characterPoints += points
			return true
		}
		const points = this.countCharacterPoints(content)
		if (this.willOverflow(points, fitFactorEffect)) {
			return
		}
		this.characterCount += this.countCharacters(content)
		this.characterPoints += points
		return true
	}

	/**
	 * Trims "inline" `content` at the "max length" (that depends on the length "points" left).
	 * @param  {(string|any[])} content — "Inline" content.
	 * @param  {string} type — One of: "new-line", "sentence-end", "whitespace", "any". `type` "new-line" is not allowed when `content` is a string.
	 * @param  {[number]} fitFactorEffect — Flexibility coefficient of the "fit factors". Examples: 0 (fit factors have no effect), 1 (fit factors have normal effect), 2 (fit factors have twice the effect), etc.
	 * @return {(string|any[])}
	 */
	trimTextContent(content, type, fitFactorEffect) {
		const trimmedBlock = this.trimAtPoint(content, type, fitFactorEffect)
		if (trimmedBlock) {
			const points = this.countCharacterPoints(trimmedBlock)
			const characters = this.countCharacters(trimmedBlock)
			if (this.willTrimLongEnoughAfter(points)) {
				this.countIn(points, characters)
				return trimmedBlock
			}
		}
	}

	trimTextContentAtNewLine(content, fitFactorEffect) {
		return this.trimTextContent(content, 'new-line', fitFactorEffect)
	}

	trimTextContentPreferrable(content, fitFactorEffect) {
		return this.trimTextContent(content, 'sentence-end', fitFactorEffect)
	}

	trimTextContentFallback(content, fitFactorEffect) {
		return this.trimTextContent(content, 'whitespace', fitFactorEffect)
	}

	trimTextContentAsIs(content, fitFactorEffect) {
		return this.trimTextContent(content, 'any', fitFactorEffect)
	}

	/**
	 * Trims text at a point.
	 * @param  {string} text
	 * @param  {string} type — One of: "sentence-end", "whitespace", "any".
	 * @param  {number} [fitFactorEffect]
	 * @return {text} [result]
	 */
	trimTextAtPoint(text, type, fitFactorEffect) {
		if (this.getCharacterPointsLeft(fitFactorEffect) === 0) {
			return
		}
		const index = this.findTrimPoint(text, type, this.getCharacterPointsLeft(fitFactorEffect) - 1)
		if (index >= 0) {
			return this.addTrimMark(text.slice(0, index + 1), type)
		}
	}

	trimAtPoint(block, type, fitFactorEffect) {
		if (typeof block === 'string') {
			// Trim `type` "new-line" is not allowed when `content` is a string.
			if (type === 'new-line') {
				throw new Error('[social-components] generatePostPreview() -> trimAtPoint(): `type` "new-line" is not allowed when `content` is a string')
			}
			return this.trimTextAtPoint(block, type, fitFactorEffect)
		}
		let trimPointIndex
		let overflow = this.countCharacterPoints(block) - this.getCharacterPointsLeft(fitFactorEffect)
		let charactersFromLineStart = 0
		const indexes = findContentPart(block, (content) => {
			// Only string parts and `.content` of object parts are counted.
			if (typeof content === 'string') {
				// Calculate part character points.
				let characterPoints = this.countCharacterPoints(content)
				// Compensate for short lines of text.
				if (content === '\n') {
					if (charactersFromLineStart < AVERAGE_LINE_CHARACTERS) {
						characterPoints += AVERAGE_LINE_CHARACTERS - charactersFromLineStart
					}
					charactersFromLineStart = 0
				} else {
					// For regular inline content "points" are same as "characters".
					charactersFromLineStart += characterPoints
				}
				// Count in the part character points.
				overflow -= characterPoints
				// If trim point reached.
				if (overflow < 0) {
					if (type === 'new-line') {
						return content === '\n'
					}
					let index = content.length - (overflow + characterPoints)
					while ((index = this.findTrimPoint(content, type, index - 1)) >= 0) {
						if (overflow + (index + 1) <= 0) {
							trimPointIndex = index
							return true
						}
					}
				}
			}
		}, { backwards: true })
		if (indexes) {
			const [left, right] = splitContent(block, indexes, {
				// Leaves the "\n" character for detecting block-level trim later in `.generate()`.
				// include: type === 'new-line' ? false : undefined,
				transformSplitPoint: type === 'new-line' ? undefined : (part) => {
					if (typeof part === 'string') {
						return this.addTrimMark(part.slice(0, trimPointIndex + 1), type)
					} else if (typeof part.content === 'string') {
						return {
							...part,
							content: this.addTrimMark(part.content.slice(0, trimPointIndex + 1), type)
						}
					} else {
						console.error('Unsupported content part for trimming')
						console.error(part)
						return part
					}
				}
			})
			return left
		}
	}

	/**
	 * Finds an appropriate trim point at `startFromIndex` for `text`.
	 * @param  {string} text
	 * @param  {string} type — One of: "sentence-end", "whitespace", "any".
	 * @param  {number} startFromIndex
	 * @return {number}
	 */
	findTrimPoint(text, type, startFromIndex) {
		switch (type) {
			case 'sentence-end':
				return findLastSentenceEnd(text, startFromIndex)
			case 'whitespace':
				return text.lastIndexOf(' ', startFromIndex)
			default:
				return startFromIndex
		}
	}

	/**
	 * Adds "trim mark" to the text.
	 * @param  {string} text — The text.
	 * @param  {string} type — One of: "sentence-end", "whitespace", "any".
	 * @return {string}
	 */
	addTrimMark(text, type) {
		switch (type) {
			case 'sentence-end':
				return text
			case 'whitespace':
				return text + this.getTextTrimMarkEndOfWord()
			case 'any':
				return text + this.getTextTrimMarkAbrupt()
		}
	}
}

function addReadMoreButton(preview, trimmedBlock) {
	// Add "Read more" button and return the preview.
	// `trimmedBlock` is either a string or an array.
	// If any whitespace is trimmed at the right side,
	// then it means that that whitespace was "\n" content parts,
	// because if it was some other whitespace, then it would
	// already have been removed when trimming the block.
	const isInlineContent = trimmedBlock && Array.isArray(trimmedBlock)
	const hasNewLinesAtTheEnd = isInlineContent && trimInlineContentOnSide(trimmedBlock, 'right')
	if (trimmedBlock && isInlineContent && !hasNewLinesAtTheEnd) {
		// Append "Read more" button to the end of the last paragraph.
		preview[preview.length - 1] = trimmedBlock.concat({ type: 'read-more' })
	} else {
		// Append "Read more" button in a new paragraph.
		preview.push({ type: 'read-more' })
	}
}
