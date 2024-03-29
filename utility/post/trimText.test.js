import _trimText from './trimText.js'

import expectToEqual from '../expectToEqual.js'

function trimText(input, maxLength, options) {
	return _trimText(input, maxLength, {
		// trimMarkEndOfSentence: '',
		// trimMarkEndOfLine: '',
		...options,
	})
}

function test(input, maxLength, output, options) {
	expectToEqual(trimText(input, maxLength, options), output)
}

describe('trimText', () => {
	it('should support maxLength = 0', () => {
		test('Abc', 0, '…')
		test('Abc', 0, '…', { getCharactersCountPenaltyForLineBreak: () => 30 })
	})

	it('should trim text', () => {
		const text = 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games Store.'
		test(text, text.length - 1, 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games Store…')
		test(text, text.length - 1, 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games …', {
			minFitFactor: 0.95
		})

		test('A b c. D e f. G h', 17, 'A b c. D e f. G h')
		test('A b c. D e f. G h', 16, 'A b c. D e f. G …')
		test('A b c. D e f. G h', 15, 'A b c. D e f. G…')
		test('A b c. D e f. G h', 14, 'A b c. D e f. …')
		test('A b c. D e f. G h', 13, 'A b c. D e f.')
		test('A b c. D e f. G', 5, 'A b c…')
		test('A b c. D e f. G', 4, 'A b …')
		test('A b c. D e f. G', 3, 'A b…')
		test('A b c. D e f. G', 2, 'A …')
		test('A b c. D e f. G', 1, 'A…')
		test('A b c. D e f. G', 0, '…')

		test('Abc.', 2, 'Ab…')
		test('AbcAbcAbc? Def.', 12, 'AbcAbcAbc?', {
			minFitFactor: 0.8
		})
		test('AbcAbcAbc! Def.', 12, 'AbcAbcAbc!', {
			minFitFactor: 0.8
		})

		test('AbcAbc. Def? Ghi', 14, 'AbcAbc. Def?', {
			minFitFactor: 0.8
		})
		test('AbcAbc. Def! Ghi', 14, 'AbcAbc. Def!', {
			minFitFactor: 0.8
		})

		test('AA b c\nD e f\nG h i', 14, 'AA b c\nD e f', {
			minFitFactor: 0.8
		})
	})

	it('shouldn\'t trim at sentence end if it\'s at less than 0.8 of max length', () => {
		// The sentence end is at less than 0.8 of the max length.
		test('A b c. D e f. G', 12, 'A b c. D e …', {
			minFitFactor: 0.8
		})
		// New line (sentence end) is at less than max length so it won't trim at that point.
		test("Embrace the 2d edition\n\nHIS GENERAL ISN'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification).", 150, 'Embrace the 2d edition\n\nHIS GENERAL ISN\'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further …', {
			minFitFactor: 0.8
		})
	})

	it('should trim at sentence end if it\'s at more than 0.8 of max length', () => {
		// The sentence end is at more than 0.8 of the max length.
		test('A b c c c c c c c. D e f. G', 22, 'A b c c c c c c c.', {
			minFitFactor: 0.8
		})
	})

	it('shouldn\'t trim at whitespace if it\'s at less than 0.8 of max length', () => {
		test('Abcd efghij', 9, 'Abcd efgh…', {
			minFitFactor: 0.8
		})
	})

	it('should trim at whitespace if it\'s at more than 0.8 of max length', () => {
		test('Abcdeffffffff ghij', 16, 'Abcdeffffffff …', {
			minFitFactor: 0.8
		})
	})

	it('should count new lines', () => {
		expectToEqual(
			trimText('Abc\nDef', 10),
			'Abc\nDef'
		)
		expectToEqual(
			trimText('Abc\nDef', 10, { getCharactersCountPenaltyForLineBreak: () => 30 }),
			'Abc'
		)
		// Everything fits.
		expectToEqual(
			trimText('Abc\nDefDefDefDef', 45, { getCharactersCountPenaltyForLineBreak: () => 30 }),
			'Abc\nDefDefDefDef'
		)
		// Test fit factors.
		// Everything fits with fit factor.
		expectToEqual(
			trimText('Abc\nDefDefDefDef', 3 + 30 + 12, { getCharactersCountPenaltyForLineBreak: () => 30, minFitFactor: 0.8 }),
			'Abc\nDefDefDefDef'
		)
		// The last line doesn't fit but is not omitted.
		expectToEqual(
			trimText('Abc\nDefDefDefDef', 3 + 30 + 4, { getCharactersCountPenaltyForLineBreak: () => 30, minFitFactor: 0.8 }),
			'Abc\nDefD…'
		)
		// The last line doesn't fit at all.
		expectToEqual(
			trimText('Abc\nDefDefDefDef', 10, { getCharactersCountPenaltyForLineBreak: () => 30, minFitFactor: 0.8 }),
			'Abc'
		)
		// When the last line being trimmed doesn't result in
		// relatively much text then it's omitted.
		expectToEqual(
			trimText('AbcAbcAbcAbcAbcAbc\nDefDefDefDefDef', 51, { getCharactersCountPenaltyForLineBreak: () => 30, minFitFactor: 0.8 }),
			'AbcAbcAbcAbcAbcAbc'
		)
		// When the last line being trimmed does result in
		// relatively enough text then it's not omitted.
		expectToEqual(
			trimText('AbcAbcAbcAbcAbcAbc\nDefDefDefDefDef', 51, { getCharactersCountPenaltyForLineBreak: () => 30, minFitFactor: 0.95 }),
			'AbcAbcAbcAbcAbcAbc\nDef…'
		)
	})

	it('should trim text', function() {
		const charactersInLine = 35
		const maxLines = 5
		let characterLimit
		if (!characterLimit) {
			characterLimit = maxLines * charactersInLine
		}
		const text = 'Почему гаёвня так помешана на шмали?\nЗаебали уже вкрай своими допросами с пристрастием при каждой второй остановке "для проверки документов". \nСмотрят в глаза, просят харкнуть на землю, задают тупые вопросы аля "а зачем тебе целый литр воды с собой, так сильно пить хочется? Сушит тебя, да?" Тщательно осматривают зажигалки, чтобы найти там ляпки, нюхают, трут пальцами, проверяют все пустые бутылки в салоне на наличие дырок, высыпают и разламывают сигареты. Такое ощущение, что они сами нарки на голяках и просто хотят нахаляву накуриться. Иначе откуда блять, такая глубочайшая осведомленность о всех приметах травокура и такое рьяное желание что-то найти? Если бы такая хуйня происходила только со мной, то я бы еще подумал, что дело во мне, но нет — многие мои друзья и знакомые рассказывали то же самое.'
		expectToEqual(
			trimText(text, characterLimit, {
				getCharactersCountPenaltyForLineBreak: ({ textBefore }) => {
					if (textBefore.length < charactersInLine) {
						return charactersInLine - textBefore.length
					}
					return charactersInLine / 2
				},
				minFitFactor: 0.5,
				maxFitFactor: 1.0
			}),
			'Почему гаёвня так помешана на шмали?\nЗаебали уже вкрай своими допросами с пристрастием при каждой второй остановке "для проверки документов". '
		)
	})
})