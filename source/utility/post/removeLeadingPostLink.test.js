import removeLeadingPostLink from './removeLeadingPostLink'

import expectToEqual from '../expectToEqual'

function expectNotRemoveLeadingPostLink(content) {
	expectToEqual(
		removeLeadingPostLink(
			{
				content
			},
			{
				id: 123
			}
		),
		{
			content
		}
	)
}

describe('removeLeadingPostLink', () => {
	it('shouldn\'t remove leading post link when there\'s none', () => {
		expectNotRemoveLeadingPostLink(undefined)
		expectNotRemoveLeadingPostLink([
			'Text'
		])
		expectNotRemoveLeadingPostLink([
			[
				'Text'
			]
		])
	})

	it('shouldn\'t remove leading post link when it\'s not the first part in paragraph', () => {
		expectNotRemoveLeadingPostLink([
			[
				'Text',
				{
					type: 'post-link',
					postId: 123
				}
			]
		])
	})

	it('shouldn\'t remove leading post link when it\'s not the first paragraph', () => {
		expectNotRemoveLeadingPostLink([
			[
				'Text'
			],
			[
				{
					type: 'post-link',
					postId: 123
				}
			]
		])
	})

	it('shouldn\'t remove leading post link when it\'s not standalone', () => {
		expectNotRemoveLeadingPostLink([
			[
				{
					type: 'post-link',
					postId: 123
				},
				'Text'
			]
		])
	})

	it('should remove leading post link', () => {
		expectToEqual(
			removeLeadingPostLink(
				{
					content: [
						[
							{
								type: 'post-link',
								postId: 123
							},
							'\n',
							'Text'
						]
					]
				},
				{
					id: 123
				}
			),
			{
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should remove post links with autogenerated quotes', () => {
		expectToEqual(
			removeLeadingPostLink(
				{
					content: [
						[
							{
								type: 'post-link',
								content: [{
									type: 'quote',
									content: 'Abc',
									generated: true
								}],
								postId: 123
							},
							'\n',
							'Text'
						]
					]
				},
				{
					id: 123
				}
			),
			{
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should leave non-autogenerated quote', () => {
		expectToEqual(
			removeLeadingPostLink(
				{
					content: [
						[
							{
								type: 'post-link',
								content: [{
									type: 'quote',
									content: 'Abc'
								}],
								postId: 123
							},
							'\n',
							'Text'
						]
					]
				},
				{
					id: 123
				}
			),
			{
				content: [
					[
						{
							type: 'post-link',
							content: [{
								type: 'quote',
								content: 'Abc'
							}],
							postId: 123
						},
						'\n',
						'Text'
					]
				]
			}
		)
	})

	it('should leave non-autogenerated quotes', () => {
		expectToEqual(
			removeLeadingPostLink(
				{
					content: [
						[
							{
								type: 'post-link',
								content: [
									{
										type: 'quote',
										content: 'Abc'
									},
									{
										type: 'quote',
										content: 'Def'
									}
								],
								postId: 123
							},
							'\n',
							'Text'
						]
					]
				},
				{
					id: 123
				}
			),
			{
				content: [
					[
						{
							type: 'post-link',
							content: [
								{
									type: 'quote',
									content: 'Abc'
								},
								{
									type: 'quote',
									content: 'Def'
								}
							],
							postId: 123
						},
						'\n',
						'Text'
					]
				]
			}
		)
	})
})