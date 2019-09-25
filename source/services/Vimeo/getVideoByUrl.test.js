import getVideoByUrl from './getVideoByUrl'

import expectToEqual from '../../utility/expectToEqual'

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