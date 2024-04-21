import censorWords_ from '../text/censorWords.js'

export default function censorWords(text, filters) {
	return censorWords_(text, filters, {
		createCensoredTextElement: (matchedText) => ({
			type: 'spoiler',
			censored: true,
			content: matchedText
		})
	})
}