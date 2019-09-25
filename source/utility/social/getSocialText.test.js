import getSocialText from './getSocialText'

import expectToEqual from '../expectToEqual'

describe('getSocialText', () => {
	it('should get social text', () => {
		expectToEqual(
			getSocialText({
				provider: 'Instagram',
				content: 'My favorite cat from tonight\'s episode- a true winner. #newgirl',
				author: {
					name: 'Zooey Deschanel',
					id: 'zooeydeschanel'
				},
				date: new Date('2013-02-20T06:17:14+00:00'),
				attachments: [{
					type: 'picture',
					picture: {
						type: 'image/jpeg',
						width: 612,
						height: 612,
						url: 'https://scontent-arn2-1.cdninstagram.com/vp/fe285833a2d6da37c81165bc7e03f8d8/5D3E22F2/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com'
					}
				}]
			}),
			'Zooey Deschanel (@zooeydeschanel): «My favorite cat from tonight\'s episode- a true winner. #newgirl»'
		)
	})

	it('should get social text when there\'s no author id', () => {
		expectToEqual(
			getSocialText({
				provider: 'Instagram',
				content: 'My favorite cat from tonight\'s episode- a true winner. #newgirl',
				author: {
					name: 'Zooey Deschanel'
				},
				date: new Date('2013-02-20T06:17:14+00:00'),
				attachments: [{
					type: 'picture',
					picture: {
						type: 'image/jpeg',
						width: 612,
						height: 612,
						url: 'https://scontent-arn2-1.cdninstagram.com/vp/fe285833a2d6da37c81165bc7e03f8d8/5D3E22F2/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com'
					}
				}]
			}),
			'Zooey Deschanel: «My favorite cat from tonight\'s episode- a true winner. #newgirl»'
		)
	})

	it('should get social text when there\'re only attachments', () => {
		expectToEqual(
			getSocialText(
				{
					provider: 'Instagram',
					author: {
						id: 'zooeydeschanel'
					},
					date: new Date('2013-02-20T06:17:14+00:00'),
					attachments: [{
						type: 'picture',
						picture: {
							type: 'image/jpeg',
							width: 612,
							height: 612,
							url: 'https://scontent-arn2-1.cdninstagram.com/vp/fe285833a2d6da37c81165bc7e03f8d8/5D3E22F2/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com'
						}
					}]
				},
				{
					picture: 'Picture'
				}
			),
			'@zooeydeschanel: Picture'
		)
	})

	it('should get social text when there\'s no content or attachments', () => {
		expectToEqual(
			getSocialText({
				provider: 'Instagram',
				author: {
					name: 'Zooey Deschanel'
				},
				date: new Date('2013-02-20T06:17:14+00:00')
			}),
			'Zooey Deschanel'
		)
	})
})