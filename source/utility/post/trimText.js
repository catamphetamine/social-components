import findLastSentenceEnd from './findLastSentenceEnd'

// New line cost is 30.
// Same as in `generatePostPreview.js`.
const NEW_LINE_COST = 30

/**
 * Trims a string if it exceeds the maximum length.
 * Trims at sentence endings when available,
 * trims as-is otherwise (appending an ellipsis).
 * @param  {string} string
 * @param  {number} maxLength
 * @param  {boolean} [options.countNewLines] — Set to `true` to count new lines as `30` characters. Is `false` by default.
 * @param  {number} [options.fitFactor] — Is `1` by default.
 * @return {string}
 */
export default function trimText(string, maxLength, options) {
	let method
	if (typeof options === 'string') {
		method = options
		options = undefined
	} else {
		if (options) {
			method = options.method
		}
	}
	const fitFactor = options && options.fitFactor || 1
	if (options && options.countNewLines) {
		const lines = string.split('\n').filter(_ => _)
		string = ''
		let characters = 0
		let pointsLeft = NEW_LINE_COST + maxLength
		for (let line of lines) {
			pointsLeft -= NEW_LINE_COST
			if (pointsLeft <= 0) {
				break
			}
			if (line.length > pointsLeft) {
				if (line.length <= maxLength * (fitFactor - 1) + pointsLeft) {
					// Append the line as is because it fits.
				} else {
					// If the line to be trimmed won't result in  much text
					// then it should be omitted for better readability.
					if (pointsLeft < (fitFactor - 1) * characters) {
						// Omits the last line being trimmed if it doesn't result in relatively much text.
						break
					}
					const reFitFactor = 1 + maxLength * (fitFactor - 1) / pointsLeft
					line = _trimText(line, pointsLeft, method, reFitFactor)
				}
			}
			if (!line) {
				break
			}
			string += '\n'
			string += line
			characters += line.length
			pointsLeft -= line.length
		}
		// Remove the leading `\n`.
		return string.slice('\n'.length)
	}
	return _trimText(string, maxLength, method, fitFactor)
}

function _trimText(string, maxLength, method, fitFactor) {
	if (string.length <= maxLength * fitFactor) {
		return string
	}
	// Trim by end of sentence.
	if (!method || method === 'sentence-end' || method === 'sentence-or-word-end') {
		const longerSubstring = string.slice(0, maxLength * fitFactor)
		const result = trimByEndOfSentence(longerSubstring)
		if (result && result.length > 0.7 * maxLength) {
			return result
		}
	}
	string = string.slice(0, maxLength)
	// Trim by end of word (if available).
	if (!method || method === 'sentence-or-word-end') {
		const lastWordEndsAtPlusOne = string.lastIndexOf(' ')
		if (lastWordEndsAtPlusOne >= 0 && lastWordEndsAtPlusOne > 0.8 * maxLength) {
			return string.slice(0, lastWordEndsAtPlusOne).trim() + ' ' + '…'
		}
	}
	// Simple trim.
	if (!method) {
		return string.slice(0, maxLength) + '…'
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
			// it could return, for example, `"Abc.\n"`.
			// Such whitespace at the end should be trimmed.
			.replace(/\s*$/, '')
	}
}