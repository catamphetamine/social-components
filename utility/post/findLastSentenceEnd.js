const END_OF_SENTENCE_PUNCTUATION = ['.', '…', '?', '!']

const WHITESPACE = /\s/

export default function findLastSentenceEnd(text, startIndex) {
	if (startIndex === undefined || startIndex >= text.length) {
		startIndex = text.length - 1
	}
	let i = startIndex
	while (i >= 0) {
		for (const character of END_OF_SENTENCE_PUNCTUATION) {
			if (text[i] === character) {
				if (i === text.length - 1) {
					return i
				}
				let j = 1
				while (i + j < text.length && WHITESPACE.test(text[i + j])) {
					// Skip whitespace.
					j++
				}
				// At least one whitespace must be skipped.
				if (j > 1) {
					if (i + j === text.length) {
						return i
					}
					// The next sentence must start with a title-case letter.
					// This is to prevent it from confusing shortenings (like "i.e.")
					// with sentence endings.
					if (text[i + j] === text[i + j].toUpperCase()) {
						return i
					}
				}
			}
		}
		i--
	}
	return -1
}