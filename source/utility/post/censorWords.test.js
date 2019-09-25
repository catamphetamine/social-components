import expectToEqual from '../expectToEqual'

import censorWords from './censorWords'
import compileWordPatterns from './compileWordPatterns'

function censorWordsTest(text, expected) {
	expectToEqual(
		censorWords(
			text,
			compileWordPatterns(
				[
					'яйц.{1,3}',
					'блин.*',
					'^конструкци.*',
					'.*черепица$',
					'сковород.*'
				],
				'ru'
			)
		),
		expected
	)
}

describe('censorWords', () => {
	it('should return the initial string when nothing is ignored', () => {
		censorWordsTest(
			'Добавляются ингридиенты и запекается продукт на печи.',
			'Добавляются ингридиенты и запекается продукт на печи.'
		)
	})

	it('should handle ^-rules at the start of a word', () => {
		censorWordsTest(
			'Металлоконструкция',
			'Металлоконструкция'
		)
		censorWordsTest(
			'Конструкция',
			[{
				type: 'spoiler',
				censored: true,
				content: 'Конструкция'
			}]
		)
	})

	it('should handle $-rules at the end of a word', () => {
		censorWordsTest(
			'Металлочерепицами',
			'Металлочерепицами'
		)
		censorWordsTest(
			'Металлочерепица',
			[{
				type: 'spoiler',
				censored: true,
				content: 'Металлочерепица'
			}]
		)
	})

	it('should replace ignored words (case-insensitive)', () => {
		censorWordsTest(
			'Добавляются яйца и запекается блин на сковороде.',
			[
				'Добавляются ',
				{
					type: 'spoiler',
					censored: true,
					content: 'яйца'
				},
				' и запекается ',
				{
					type: 'spoiler',
					censored: true,
					content: 'блин'
				},
				' на ',
				{
					type: 'spoiler',
					censored: true,
					content: 'сковороде'
				},
				'.'
			]
		)
	})
})