import getVideoByUrl from './getVideoByUrl.js'

import expectToEqual from '../../utility/expectToEqual.js'

// `getImageSize()` won't work on server side, so this test is skipped.
describe.skip('Vimeo/video', () => {
	it('should get Vimeo video by URL', async () => {
		expectToEqual(
			await getVideoByUrl('http://vimeo.com/25451551'), {
				"provider": "Vimeo",
				"id": "25451551"
			}
		)
	})
})