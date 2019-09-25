import getVideo from './getVideo'
import parseVideoUrl from './parseVideoUrl'

/**
 * Parses YouTube video URL (if it's a video URL).
 * Supported YouTube URL formats:
 * http://www.youtube.com/watch?v=My2FRPA3Gf8
 * http://youtu.be/My2FRPA3Gf8
 * @param  {string} url
 * @param  {string} [options.locale] — Isn't used.
 * @param  {boolean} [options.picture] — Set to `false` to disable looking up video thumbnail.
 * @param  {(string|string[])} [options.youTubeApiKey] — YouTube API v3 key. YouTube has a limit of `1 000 000` API requests per day for a key.
 * @return {object} [video] Returns `null` if the video doesn't exist. Returns `undefined` if it's not a YouTube video.
 */
export default async function getVideoByUrl(url, options) {
	const {
		locale,
		picture,
		youTubeApiKey
	} = options
	const { id, startAt } = parseVideoUrl(url)
	// Get video info by ID.
	if (id) {
		return getVideo(id, {
			...options,
			startAt
		})
	}
}