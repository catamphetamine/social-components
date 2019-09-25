import getVideo from './getVideo'

import { getUrlQueryPart } from '../../utility/url'

/**
 * Parses `vimeo.com` video by URL.
 * Supported URL formats:
 * * http://vimeo.com/25451551
 * * http://player.vimeo.com/video/25451551
 * @param  {string} url
 * @return {object} [video]
 */
export default async function getVideoByUrl(url) {
	// Parse video ID.
	let id
	const location = new URL(url)
	if (location.hostname === 'vimeo.com') {
		id = location.pathname.slice('/'.length)
	} else if (location.hostname === 'player.vimeo.com') {
		if (location.pathname.indexOf('/video/') === 0) {
			id = location.pathname.slice('/video/'.length)
		}
	}
	if (id) {
		try {
			return await getVideo(id)
		} catch (error) {
			console.error(error)
		}
	}
}