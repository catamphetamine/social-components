import findLastSentenceEnd from './findLastSentenceEnd.js'

// const MIN_FIT_FACTOR = 0.7
// const MAX_FIT_FACTOR = 1.35

const MIN_FIT_FACTOR = 1
export const MAX_FIT_FACTOR = 1

const DEFAULT_TRIM_MARK_END_OF_LINE = '' // ' …'
const DEFAULT_TRIM_MARK_END_OF_SENTENCE = '' // ' …'
const DEFAULT_TRIM_MARK_END_OF_WORD = ' …'
const DEFAULT_TRIM_MARK_ABRUPT = '…'

/**
 * Trims a string if it exceeds the maximum length.
 * Trims at sentence endings when available,
 * trims as-is otherwise (appending an ellipsis).
 * @param  {string} string
 * @param  {number} maxLength
 * @param  {function} [options.getCharactersCountPenaltyForLineBreak] — Returns characters count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by characters count. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted.
 * @param  {number} [options.minFitFactor] — `maxLength` lower boundary extension. Example: `0.75` means `minLength` could be `0.75 * maxLength`.
 * @param  {number} [options.maxFitFactor] — `maxLength` upper boundary extension. Example: `1.35` means `maxLength` could be `1.35 * maxLength`.
 * @param  {string} [options.trimPoint] — Preferrable trim point. Can be `undefined` (default), "sentence-end", "sentence-or-word-end". By default it starts with seeing if it can trim at "sentence-end", then tries to trim at "sentence-or-word-end", and then just trims at any point.
 * @param  {string} [options.trimMarkEndOfLine] — "Trim mark" when trimming at the end of a line. Is "" (no trim mark) by default.
 * @param  {string} [options.trimMarkEndOfSentence] — "Trim mark" when trimming at the end of a sentence. Is "" (no trim mark) by default.
 * @param  {string} [options.trimMarkEndOfWord] — "Trim mark" when trimming at the end of a word. Is " …" by default.
 * @param  {string} [options.trimMarkAbrupt] — "Trim mark" when trimming mid-word. Is "…" by default.
 * @return {string} [trimmedText]
 */
export default function trimText(string, maxLength, options = {}) {
	// Initialize options.
	const {
		trimPoint,
		getCharactersCountPenaltyForLineBreak
	} = options
	let {
		minFitFactor,
		maxFitFactor,
		trimMarkEndOfLine,
		trimMarkEndOfSentence,
		trimMarkEndOfWord,
		trimMarkAbrupt
	} = options
	if (minFitFactor === undefined) {
		minFitFactor = MIN_FIT_FACTOR
	}
	if (maxFitFactor === undefined) {
		maxFitFactor = MAX_FIT_FACTOR
	}
	if (trimMarkEndOfLine === undefined) {
		trimMarkEndOfLine = DEFAULT_TRIM_MARK_END_OF_LINE
	}
	if (trimMarkEndOfSentence === undefined) {
		trimMarkEndOfSentence = DEFAULT_TRIM_MARK_END_OF_SENTENCE
	}
	if (trimMarkEndOfWord === undefined) {
		trimMarkEndOfWord = DEFAULT_TRIM_MARK_END_OF_WORD
	}
	if (trimMarkAbrupt === undefined) {
		trimMarkAbrupt = DEFAULT_TRIM_MARK_ABRUPT
	}
	// Trim while not handling "new lines" in a special way.
	if (!getCharactersCountPenaltyForLineBreak) {
		return _trimText(string, maxLength, trimPoint, minFitFactor, maxFitFactor, trimMarkEndOfLine, trimMarkEndOfSentence, trimMarkEndOfWord, trimMarkAbrupt)
	}
	// Edge case.
	if (!string) {
		return string
	}
	// Trim while handling "new lines" in a special way,
	// each "new line" character having a "cost"
	// (which is an equivalent of characters count).
	const lines = string.split('\n').filter(_ => _)
	string = ''
	let characters = 0
	let pointsLeft = maxLength
	let i = 0
	while (i < lines.length) {
		let line = lines[i]
		// If the line is too long then see if it could be trimmed.
		if (line.length > pointsLeft) {
			// See if the line fits with `maxFitFactor`.
			// Using `(characters + pointsLeft)` instead of `maxLength` here
			// because `(characters + pointsLeft)` doesn't count new lines
			// and is therefore more appropriate for "relative text length" comparisons.
			if (characters + line.length <= (characters + pointsLeft) * maxFitFactor) {
				// Append the line as is because it fits with `maxFitFactor`.
			} else {
				// The line doesn't fit with `maxFitFactor`. See if it could be trimmed.
				// Scale `minFitFactor` and `maxFitFactor` proportionately for this line.
				const minFitFactorForLine = 1 - (1 - minFitFactor) * (maxLength / pointsLeft)
				const maxFitFactorForLine = 1 + (maxFitFactor - 1) * (maxLength / pointsLeft)
				// If, without appending this line, there's already enough characters
				// in the `string` so far, then there's no need to append this line at all.
				// Using `(characters + pointsLeft)` instead of `maxLength` here
				// because `(characters + pointsLeft)` doesn't count new lines
				// and is therefore more appropriate for "relative text length" comparisons.
				if (characters >= (characters + pointsLeft) * minFitFactor) {
					// See if this line could be trimmed at sentence end.
					// If it can, then append it in its trimmed variant.
					// If it can't, then just ignore this line, since there's already enough characters.
					const lineTrimmedAtSentenceEnd = _trimText(line, pointsLeft, 'sentence-end', minFitFactorForLine, maxFitFactorForLine, trimMarkEndOfLine, trimMarkEndOfSentence, trimMarkEndOfWord, trimMarkAbrupt)
					if (lineTrimmedAtSentenceEnd) {
						line = lineTrimmedAtSentenceEnd
					} else {
						// Omit the last line, because it doesn't result in relatively much text anyway.
						line = undefined
					}
				} else {
					line = _trimText(line, pointsLeft, trimPoint, minFitFactorForLine, maxFitFactorForLine, trimMarkEndOfLine, trimMarkEndOfSentence, trimMarkEndOfWord, trimMarkAbrupt)
				}
			}
		}
		if (!line) {
			if (string) {
				string += trimMarkEndOfLine
			} else {
				string += trimMarkAbrupt
			}
			break
		}
		if (string) {
			string += '\n'
		}
		string += line
		characters += line.length
		pointsLeft -= line.length + getCharactersCountPenaltyForLineBreak({ textBefore: line })
		i++
	}
	return string
}

/**
 * Trims text.
 * @param  {string} text
 * @param  {number} maxLength
 * @param  {string} [trimPoint] — One of: `undefined`, "sentence-end", "sentence-or-word-end". In case of adding new trim point types here, also change `trimText()` function accordingly when it tries to trim the line by end of sentence if the total length already exceeds min length.
 * @param  {number} minFitFactor
 * @param  {number} maxFitFactor
 * @param  {string} trimMarkEndOfLine
 * @param  {string} trimMarkEndOfSentence
 * @param  {string} trimMarkEndOfWord
 * @param  {string} trimMarkAbrupt
 * @return {string} [trimmedText]
 */
function _trimText(string, maxLength, trimPoint, minFitFactor, maxFitFactor, trimMarkEndOfLine, trimMarkEndOfSentence, trimMarkEndOfWord, trimMarkAbrupt) {
	if (string.length <= maxLength * maxFitFactor) {
		return string
	}
	// Trim by end of sentence.
	if (!trimPoint || trimPoint === 'sentence-end' || trimPoint === 'sentence-or-word-end') {
		const longerSubstring = string.slice(0, maxLength * maxFitFactor)
		const result = trimByEndOfSentence(longerSubstring)
		if (result) {
			if (result.length <= maxLength * maxFitFactor) {
				if (result.length >= maxLength * minFitFactor) {
					return result + trimMarkEndOfSentence
				}
			}
		}
	}
	string = string.slice(0, maxLength * maxFitFactor)
	// Trim by end of word (if available).
	if (!trimPoint || trimPoint === 'sentence-or-word-end') {
		// At this point, it has already tried to search for end of sentence,
		// and didn't find any, so if it finds something here, then it's end of word.
		const lastWordEndsAtPlusOne = string.lastIndexOf(' ')
		if (lastWordEndsAtPlusOne >= 0 && lastWordEndsAtPlusOne >= minFitFactor * maxLength) {
			return string.slice(0, lastWordEndsAtPlusOne) + trimMarkEndOfWord
		}
	}
	// Simple trim.
	if (!trimPoint) {
		return string.slice(0, maxLength) + trimMarkAbrupt
	}
}

function trimByEndOfSentence(string, options) {
	// Trim by end of sentence (if available).
	let trimAtIndex
	const lastNewLineIndex = string.lastIndexOf('\n')
	if (lastNewLineIndex >= 0) {
		trimAtIndex = lastNewLineIndex - 1
	}
	const lastEndOfSentenceIndex = findLastSentenceEnd(string)
	if (lastEndOfSentenceIndex >= 0) {
		if (trimAtIndex !== undefined) {
			trimAtIndex = Math.max(trimAtIndex, lastEndOfSentenceIndex)
		} else {
			trimAtIndex = lastEndOfSentenceIndex
		}
	}
	if (trimAtIndex !== undefined) {
		return string.slice(0, trimAtIndex + 1)
			// There may be sentences like "Abc.\n\nDef."
			// and when trimming by "end of sentence"
			// it could return, for example, `"Abc.\n"`,
			// which should have been trimmed instead.
			// So, whitespace at the end should be trimmed.
			.replace(/\s*$/, '')
	}
}