export default function compileWordPatterns(patterns, language) {
	return patterns.reduce((all, pattern) => all.concat(compileWordPattern(pattern, language)), [])
}

function compileWordPattern(pattern, language, includesWordStart, includesWordEnd) {
	if (includesWordStart === undefined && pattern[0] === '^') {
		pattern = pattern.slice('^'.length)
		return [].concat(
			compileWordPattern('^' + pattern, language, false, includesWordEnd),
			compileWordPattern('[' + getNonLetter(language) + ']' + pattern, language, true, includesWordEnd)
		)
	}
	if (includesWordEnd === undefined && pattern[pattern.length - 1] === '$') {
		pattern = pattern.slice(0, pattern.length - '$'.length)
		return [].concat(
			compileWordPattern(pattern + '$', language, includesWordStart, false),
			compileWordPattern(pattern + '[' + getNonLetter(language) + ']', language, includesWordStart, true)
		)
	}
	// Replace `.`s with letter character patterns.
	pattern = pattern.replace(/\./g, '[' + getLetter(language) + ']')
	return {
		includesWordStart,
		includesWordEnd,
		regexp: new RegExp(pattern, 'i')
	}
}

export const LETTER = {
	en: 'a-z',
	de: 'a-zäöüß',
	ru: 'а-яё',
	default: '^\\s\\.,!?:;()0-9-'
}

function getLetter(language) {
	switch (language) {
		case 'en':
			return LETTER.en
		case 'de':
			return LETTER.de
		case 'ru':
			return LETTER.ru
		default:
			return LETTER.default
	}
}

function getNonLetter(language) {
	return invertPattern(getLetter(language))
}

/**
 * Receives a "letter character" definition pattern
 * and inverts it (either adds or removes leading `^`).
 * "Letter character" definition pattern can't contain `[]`.
 */
// Matches "abc" and "^abc".
const LETTER_CHARACTER_DEFINITION = /^(\^)?([^\]]+)/
function invertPattern(pattern) {
	// Invert the letter pattern.
	const match = pattern.match(LETTER_CHARACTER_DEFINITION)
	if (match) {
		return `${match[1] ? '' : '^'}${match[2]}`
	}
}