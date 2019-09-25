export default function compileWordPatterns(filters, language) {
	return filters.reduce((all, filter) => all.concat(compileWordPattern(filter, language)), [])
}

function compileWordPattern(filter, language, includesWordStart, includesWordEnd) {
	if (includesWordStart === undefined && filter[0] === '^') {
		filter = filter.slice('^'.length)
		return [].concat(
			compileWordPattern('^' + filter, language, false, includesWordEnd),
			compileWordPattern('[' + getNonLetter(language) + ']' + filter, language, true, includesWordEnd)
		)
	}
	if (includesWordEnd === undefined && filter[filter.length - 1] === '$') {
		filter = filter.slice(0, filter.length - '$'.length)
		return [].concat(
			compileWordPattern(filter + '$', language, includesWordStart, false),
			compileWordPattern(filter + '[' + getNonLetter(language) + ']', language, includesWordStart, true)
		)
	}
	// Replace letters.
	filter = filter.replace(/\./g, '[' + getLetter(language) + ']')
	return {
		includesWordStart,
		includesWordEnd,
		regexp: new RegExp(filter, 'i')
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

// Matches "abc" and "^abc".
const LETTER_REGEXP = /^(\^)?([^\]]+)/
function invertPattern(pattern) {
	// Invert the letter pattern.
	const match = pattern.match(LETTER_REGEXP)
	if (match) {
		return `${match[1] ? '' : '^'}${match[2]}`
	}
}