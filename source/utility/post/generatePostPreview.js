import trimText from './trimText'
import { trim } from './trimWhitespace'
import searchContent from './searchContent'
import findLastSentenceEnd from './findLastSentenceEnd'
import splitContent from './splitContent'
import countCharacters, {
	AVERAGE_LINE_CHARACTERS,
	NEW_LINE_COST
} from './countTextBlockCharacters'
import countIfNonTextPostBlockFits from './countIfNonTextPostBlockFits'
import getContentBlocks from './getContentBlocks'

const NEW_PARAGRAPH_COST = 60

// If the total content length doesn't exceed
// `(1 + fitFactor) * limit` then preview is not neccessary.
const FIT_FACTOR = 0.2

const ENOUGH_CONTENT_FACTOR = 0.75

/**
 * Generates a shortened "preview" of `content`.
 * @param  {any} content
 * @param  {object[]} [attachments] — If the `content` has any embedded attachments, `attachments` list must be passed.
 * @param  {number} options.limit — Preview content (soft) limit (in "points").
 * @param  {number} [options.fitFactor] — `limit` "softness" (`limit = (1 + fitFactor) * limit`) .
 * @return {any}
 */
export default function generatePostPreview(content, attachments, options) {
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

	constructor(content, attachments, options) {
		this.content = content
		this.attachments = attachments
		this.options = options
	}

	generate() {
		let i = -1
		for (const block of this.content) {
			i++
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
					const points = countCharacters(block, 'points')
					const characters = countCharacters(block, 'characters')
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
				const points = countCharacters(block, 'points')
				const characters = countCharacters(block, 'characters')
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
				this.preview.push(trimmedBlock)
			}
			if (trimmedBlock === block && this.characterPoints > this.options.limit) {
				trimmedBlock = undefined
			}
			// If trim point reached.
			if (trimmedBlock !== block) {
				// See if the rest content exceeds the threshold.
				let points = this.blockLevelTrimCharacterPoints
				// `block` could be a `string` which means that
				// `.indexOf(block)` could confuse two identical string blocks.
				// let i = this.content.indexOf(block)
				let restContentExceedsThreshold = false
				const countIfFits = (count) => {
					if (typeof count !== 'number') {
						count = countCharacters(count, 'points')
					}
					if (!this.doesExceedThreshold(points + count)) {
						points += count
						return true
					}
				}
				while (i < this.content.length) {
					const block = this.content[i]
					if (typeof block === 'string' || Array.isArray(block)) {
						points += countCharacters(block, 'points')
						if (this.doesExceedThreshold(points)) {
							restContentExceedsThreshold = true
						}
					} else {
						restContentExceedsThreshold = true
						// Returns `true` if the `block` fits entirely.
						// Returns a shortened `block` if the `block` fits partially (for example, a `list`).
						// Returns nothing if the `block` doesn't fit.
						const result = countIfNonTextPostBlockFits(block, this.attachments, this.countIfFits)
						if (result === true) {
							restContentExceedsThreshold = false
						}
						// Partial fit case is ignored here.
					}
					if (restContentExceedsThreshold) {
						break
					}
					points += NEW_PARAGRAPH_COST
					i++
				}
				// If the rest content doesn't exceed the threshold
				// then don't generate a preview.
				if (!restContentExceedsThreshold) {
					return
				}
				// Add "Read more" button and return the preview.
				const hadNewLinesAtTheEnd = trimmedBlock && typeof trimmedBlock !== 'string' && trim(trimmedBlock, 'right')
				let isEmpty
				if (trimmedBlock && !hadNewLinesAtTheEnd) {
					// Append "Read more" button to the end of the last paragraph.
					this.preview[this.preview.length - 1] = addReadMore(trimmedBlock)
				} else {
					isEmpty = this.preview.length === 0
					// Append "Read more" button in a new paragraph.
					this.preview.push({ type: 'read-more' })
				}
				// A preview can't be empty.
				if (isEmpty) {
					this.preview.unshift(getContentBlocks(this.content)[0])
				}
				return this.preview
			}
			this.characterPoints += NEW_PARAGRAPH_COST
			this.blockLevelTrimCharacterCount = this.characterCount
			this.blockLevelTrimCharacterPoints = this.characterPoints
		}
	}

	doesExceedThreshold(points) {
		return points > this.characterPoints * (1 + this.getFitFactor())
	}

	getFitFactor() {
		return this.options.fitFactor === undefined ? FIT_FACTOR : this.options.fitFactor
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to discard current paragraph.
	//
	// It would be more preferable to use "characters left" instead of "character points left"
	// but calculating "characters left" in context of a non-fitting block is extra computation
	// which is chosen to be avoided here for simplicity.
	//
	willTrimLongEnoughAt(characterCount) {
		return characterCount > ENOUGH_CONTENT_FACTOR * (this.characterCount + this.getCharacterPointsLeft())
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to trim in the middle of current paragraph.
	//
	willTrimLongEnoughAfter(estimatedCharacterCount) {
		return this.willTrimLongEnoughAt(this.characterCount + estimatedCharacterCount)
	}

	getCharacterPointsLeft(fitFactor) {
		return this.withFitFactor(this.options.limit, fitFactor) - this.characterPoints
	}

	countIn(content, arg2) {
		if (typeof content === 'number') {
			this.characterPoints += content
			this.characterCount += arg2
		} else {
			this.characterPoints += countCharacters(content, 'points')
			this.characterCount += countCharacters(content, 'characters')
		}
	}

	willOverflow(points, fitFactor) {
		return this.characterPoints + points > this.withFitFactor(this.options.limit, fitFactor)
	}

	withFitFactor(points, fitFactor = 0) {
		if (fitFactor) {
			return Math.floor(points * (1 + fitFactor * this.getFitFactor()))
		} else {
			return points
		}
	}

	countIfFits = (content, fitFactor, arg3) => {
		if (typeof content === 'number') {
			const points = content
			const characters = fitFactor
			fitFactor = arg3
			if (this.willOverflow(points, fitFactor)) {
				return
			}
			this.characterCount += characters
			this.characterPoints += points
			return true
		}
		const points = countCharacters(content, 'points')
		if (this.willOverflow(points, fitFactor)) {
			return
		}
		this.characterCount += countCharacters(content, 'characters')
		this.characterPoints += points
		return true
	}

	trimTextContent(content, type, fitFactor) {
		const trimmedBlock = this.trimAtPoint(content, type, fitFactor)
		if (trimmedBlock) {
			const points = countCharacters(trimmedBlock, 'points')
			const characters = countCharacters(trimmedBlock, 'characters')
			if (this.willTrimLongEnoughAfter(points)) {
				this.countIn(points, characters)
				return trimmedBlock
			}
		}
	}

	trimTextContentAtNewLine(content, fitFactor) {
		return this.trimTextContent(content, 'new-line', fitFactor)
	}

	trimTextContentPreferrable(content, fitFactor) {
		return this.trimTextContent(content, 'sentence-end', fitFactor)
	}

	trimTextContentFallback(content, fitFactor) {
		return this.trimTextContent(content, 'whitespace', fitFactor)
	}

	trimTextContentAsIs(content, fitFactor) {
		return this.trimTextContent(content, 'any', fitFactor)
	}

	trimTextAtPoint(text, type, fitFactor) {
		if (this.getCharacterPointsLeft(fitFactor) === 0) {
			return
		}
		const index = this.findTrimPoint(text, type, this.getCharacterPointsLeft(fitFactor) - 1)
		if (index >= 0) {
			text = text.slice(0, index + 1)
			if (type === 'any' || type === 'whitespace') {
				text += '…'
			}
			return text
		}
	}

	trimAtPoint(block, type, fitFactor) {
		if (typeof block === 'string') {
			return this.trimTextAtPoint(block, type, fitFactor)
		}
		let trimPointIndex
		let overflow = countCharacters(block, 'points') - this.getCharacterPointsLeft(fitFactor)
		let charactersFromLineStart = 0
		const indexes = searchContent(block, (content) => {
			// Only string parts and `.content` of object parts are counted.
			if (typeof content === 'string') {
				// Calculate part character points.
				let characterPoints = countCharacters(content, 'points')
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
						return trimTextAtIndex(part, trimPointIndex + 1, type)
					} else if (typeof part.content === 'string') {
						return {
							...part,
							content: trimTextAtIndex(part.content, trimPointIndex + 1, type)
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

	findTrimPoint(text, type, startFromIndex) {
		if (type === 'sentence-end') {
			return findLastSentenceEnd(text, startFromIndex)
		}
		if (type === 'whitespace') {
			return text.lastIndexOf(' ', startFromIndex)
		}
		return startFromIndex
	}
}

function addReadMore(content) {
	if (!Array.isArray(content)) {
		content = [content]
	}
	content.push({ type: 'read-more' })
	return content
	// `trimWhitespace` mutates content, so no point in immutability.
	// return content.concat({ type: 'read-more' })
}

function trimTextAtIndex(text, index, type) {
	text = text.slice(0, index)
	if (type === 'any' || type === 'whitespace') {
		text += '…'
	}
	return text
}