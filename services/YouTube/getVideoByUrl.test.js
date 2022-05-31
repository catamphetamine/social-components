import getVideoByUrl from './getVideoByUrl.js'

import expectToEqual from '../../utility/expectToEqual.js'

describe('YouTube/video', () => {
	it('should get YouTube video by URL with start time', async () => {
		expectToEqual(
			await getVideoByUrl('https://www.youtube.com/watch?v=6CPXGQ0zoJE&t=20', {
				picture: false
			}),
			{
				"provider": "YouTube",
				"id": "6CPXGQ0zoJE",
				"startAt": 20
			}
		)
	})

	it('should get YouTube video by short URL with start time', async () => {
		expectToEqual(
			await getVideoByUrl('https://youtu.be/6CPXGQ0zoJE?t=21', {
				picture: false
			}),
			{
				"provider": "YouTube",
				"id": "6CPXGQ0zoJE",
				"startAt": 21
			}
		)
	})
})