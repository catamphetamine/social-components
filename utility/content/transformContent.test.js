import expectToEqual from '../expectToEqual.js'
import transformContent from './transformContent.js'

function transformContentTest(content, transform, result) {
	// `content` internals will be mutated.
	transformContent(content, transform)
	return expectToEqual(content, result)
}

describe('transformContent', () => {
	it('should transform content (strings)', () => {
		transformContentTest(
			[
				[
					'Abc'
				],
				[
					'Def'
				],
				[
					'Ghi'
				]
			],
			(part) => {
				if (part === 'Abc') {
					return 'ABC'
				}
				if (part === 'Def') {
					return {
						type: 'spoiler',
						content: part
					}
				}
			},
			[
				[
					'ABC'
				],
				[
					{
						type: 'spoiler',
						content: 'Def'
					}
				],
				[
					'Ghi'
				]
			]
		)
	})

	it('should transform nested .content, and not recurse when `transform()` returns `false`', () => {
		transformContentTest(
			[
				[
					{
						type: 'spoiler',
						censored: true,
						content: [
							'Abc',
							{
								type: 'text',
								style: 'bold',
								content: [
									'Def'
								]
							}
						]
					},
					{
						type: 'spoiler',
						content: [
							'Ghi',
							{
								type: 'text',
								style: 'bold',
								content: [
									'Def'
								]
							}
						]
					},
					{
						type: 'text',
						style: 'bold',
						content: [
							'Def'
						]
					}
				]
			],
			(part) => {
				if (part.type === 'spoiler' && part.censored) {
					return false
				}
				if (part === 'Def') {
					return 'DDD'
				}
			},
			[
				[
					{
						type: 'spoiler',
						censored: true,
						content: [
							'Abc',
							{
								type: 'text',
								style: 'bold',
								content: [
									'Def'
								]
							}
						]
					},
					{
						type: 'spoiler',
						content: [
							'Ghi',
							{
								type: 'text',
								style: 'bold',
								content: [
									'DDD'
								]
							}
						]
					},
					{
						type: 'text',
						style: 'bold',
						content: [
							'DDD'
						]
					}
				]
			]
		)
	})

	it('should expand arrays returned from `transform()`', () => {
		transformContentTest(
			[
				[
					{
						type: 'spoiler',
						content: [
							'Pre',
							'Abc',
							'Post'
						]
					},
					'Def',
					'Ghi'
				],
				{
					type: 'code',
					content: '<code/>'
				}
			],
			(part) => {
				if (part === 'Abc') {
					return [
						'A',
						'B'
					]
				}
				if (part === 'Def') {
					return [
						{
							type: 'spoiler',
							content: 'D'
						},
						{
							type: 'spoiler',
							content: 'E'
						}
					]
				}
				if (part.type === 'code') {
					return {
						type: 'spoiler',
						content: '<code/>'
					}
				}
			},
			[
				[
					{
						type: 'spoiler',
						content: [
							'Pre',
							'A',
							'B',
							'Post'
						]
					},
					{
						type: 'spoiler',
						content: 'D'
					},
					{
						type: 'spoiler',
						content: 'E'
					},
					'Ghi'
				],
				{
					type: 'spoiler',
					content: '<code/>'
				}
			]
		)
	})

	it('should convert string `.content` to an array when `transform()` returns a non-string', () => {
		transformContentTest(
			[
				[
					{
						type: 'spoiler',
						content: 'Abc'
					}
				]
			],
			(part) => {
				if (part === 'Abc') {
					return {
						type: 'text',
						style: 'bold',
						content: part
					}
				}
			},
			[
				[
					{
						type: 'spoiler',
						content: [
							{
								type: 'text',
								style: 'bold',
								content: 'Abc'
							}
						]
					}
				]
			]
		)
	})
})

