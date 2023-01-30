import { parseQueryString } from '../../utility/url.js'
import getImageSize from '../../utility/image/getImageSize.js'

// Returns a `Promise`.
export default function getVideo(id, parameters) {
	const { locale, picture, startAt } = parameters
	let { youTubeApiKey } = parameters
	if (youTubeApiKey) {
		// Pick a random key from the list until it works.
		youTubeApiKey = toArray(youTubeApiKey)
		if (youTubeApiKey.length > 0) {
			// Pick a random key from the list (removing it from the list).
			const keyIndex = Math.floor(Math.random() * youTubeApiKey.length)
			const key = youTubeApiKey[keyIndex]
			youTubeApiKey = youTubeApiKey.slice()
			youTubeApiKey.splice(keyIndex, 1)
			// See if the key works.
			return getVideoData(id, key, { locale }).then(
				(video) => {
					// `null` means "Video doesn't exist" (for example, it was deleted).
					if (video === null) {
						return null
					}
					if (video) {
						return getVideoResult(video, id, parameters)
					}
					// The YouTube API key didn't work.
					// Retry with another key.
					return getVideo(id, {
						...parameters,
						youTubeApiKey
					})
				},
				(error) => {
					// Inability to get YouTube video info via the API
					// is not considered critical.
					console.error(error)
					// The YouTube API key didn't work.
					// Retry with another key.
					return getVideo(id, {
						...parameters,
						youTubeApiKey
					})
				}
			)
		}
	}
	return getVideoResult({}, id, parameters)
}

// Returns a `Promise`.
function getVideoResult(video, id, { picture, startAt }) {
	video.provider = 'YouTube'
	video.id = id
	if (startAt) {
		video.startAt = startAt
	}
	if (!video.picture) {
		if (picture !== false) {
			return getPicture(id).then(
				(picture) => {
					video.picture = picture
					return video
				}
				// Doesn't return an error if the picture is not found:
				// simply returns a "Not Found" picture in that case.
			)
		}
	}
	return Promise.resolve(video)
}

// Returns a `Promise<object>`.
function getPictureSize(size, { id }) {
	const url = getPictureSizeUrl(id, size.name)
	return getImageSize(url).then(
		(imageSize) => {
			if (imageSize.width === PREVIEW_NOT_FOUND_PICTURE_SIZE.width) {
				console.error(`YouTube preview size "${size.name}" not found for video "${id}"`)
			} else {
				return {
					type: 'image/jpeg',
					url,
					...imageSize
				}
			}
		},
		(error) => {
			console.error(error)
		}
	)
}

// Returns a `Promise<object>`.
function getPicture(id, { sizeIndex = 0 } = {}) {
	// `getImageSize()` only works on client side.
	if (typeof Image !== 'undefined') {
		if (sizeIndex < PREVIEW_PICTURE_SIZES.length) {
			return getPictureSize(PREVIEW_PICTURE_SIZES[sizeIndex], { id }).then((imageSize) => {
				if (imageSize) {
					return imageSize
				}
				return getPicture(id, { sizeIndex: sizeIndex + 1 })
			})
		}
	}

	console.error(`No picture found for YouTube video "${id}"`)

	return Promise.resolve({
		type: 'image/jpeg',
		...PREVIEW_NOT_FOUND_PICTURE_SIZE,
		url: getPictureSizeUrl(id, PREVIEW_PICTURE_SIZES[0].name)
	})

	// throw new Error(`No picture found for YouTube video ${id}`)
}

/**
 * Gets YouTube video info.
 * API method: https://developers.google.com/youtube/v3/docs/videos/list
 * Uses "contentDetails" (quota cost 2) and "snippet" (quota cost 2) parts.
 * "contentDetails" is for the video duration and aspect ratio.
 * "snippet" is for the video title and description.
 * "localization" (quota cost 2) part could theoretically be used
 * but it only returns the title/description for the requested locale, not for all of them.
 * YouTube has a quota limit of 1 million per day which translates to 250 000 videos per day.
 * They can track the "HTTP Referrer" so they will know if someone's using several keys
 * to bypass the quota. But perhaps they don't care much.
 * https://www.freakyjolly.com/youtube-data-api-v3-1m-units-limits-explained/
 * In their user agreement they stated that only "one project per client" may be used to
 * send API requests which would mean that creating multiple "projects"
 * (which means getting multiple keys) is considered a violation fo the user agreement.
 * https://stackoverflow.com/questions/43782892/extending-youtube-api-quota-with-limited-funds
 * Still, perhaps they don't care much.
 * "fileDetails" (quota cost 1) part could be used for getting video resolution
 * (`fileDetails.videoStreams[].widthPixels`) but it's available only to video owner.
 * Could alternatively use YouTube's unofficial "oembed" endpoint, like:
 * https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=INVdbXTuPVI
 * It returns video "title" and also `aspectRatio` = "width"/"height" (approximated).
 * But the `thumbnail_url` is incorrect. For example, for video ID "INVdbXTuPVI"
 * it says "thumbnail_url": "https://i.ytimg.com/vi/INVdbXTuPVI/hqdefault.jpg",
 * but the correct one is "https://i.ytimg.com/vi/INVdbXTuPVI/maxresdefault.jpg".
 * And also this "oembed" endpoint doesn't support neither CORS nor JSONP
 * so it's uncallable from a web browser (could be proxied though).
 * A typical "Get video info" API response is about 6KB in size.
 * @param  {string} id
 * @param  {string} youTubeApiKey
 * @param  {object} options
 * @return {Promise<object>} [video] Returns `null` if the video doesn't exist. Returns `undefined` if some error happened.
 */
function getVideoData(id, youTubeApiKey, options = {}) {
	const { locale } = options
	return fetch(`https://content.googleapis.com/youtube/v3/videos?part=snippet,contentDetails${locale ? ',localizations' : ''}&id=${id}&key=${youTubeApiKey}${locale ? '&hl=' + locale : ''}`).then(
		(response) => {
			return response.json().then(
				(json) => {
					if (json.error) {
						// Example: "Bad Request".
						const error = new Error(json.error.message)
						// Example: `400`.
						error.code = json.error.code
						// Example: `[{domain: "usageLimits", reason: "keyInvalid", message: "Bad Request"}]`.
						error.errors = json.error.errors
						throw error
					}
					if (json.items.length === 0) {
						console.error(`YouTube video "${id}" not found`)
						// `null` means "Video doesn't exist".
						return null
					}
					const { snippet, contentDetails } = json.items[0]
					const pictureSizes = (
						(snippet.thumbnails.medium || snippet.thumbnails.maxres) ? [
							// 320 x 180 (HD).
							snippet.thumbnails.medium,
							// 1280 x 720 (HD).
							snippet.thumbnails.maxres
						] : [
							// 120 x 90 (4:3, non-HD).
							snippet.thumbnails.default,
							// 480 x 360 (4:3, non-HD)
							snippet.thumbnails.high,
							// 640 x 480 (4:3, non-HD).
							snippet.thumbnails.standard
						]
					).filter(_ => _)
					const video = {
						title: locale ? snippet.localized.title : snippet.title,
						description: locale ? snippet.localized.description : snippet.description,
						duration: parseISO8601Duration(contentDetails.duration),
						// HD aspect ratio is 16:9 which is 1.777777777...
						// SD aspect ratio is 4:3 which is 1.3333333333...
						aspectRatio: contentDetails.definition === 'hd' ? 16/9 : 4/3,
						picture: {
							type: 'image/jpeg',
							...pictureSizes[pictureSizes.length - 1]
						}
					}
					if (pictureSizes.length > 1) {
						video.picture.sizes = pictureSizes.slice(0, pictureSizes.length - 1).map((size) => ({
							...size,
							type: 'image/jpeg'
						}))
					}
					// YouTube doesn't return video width or height.
					switch (contentDetails.definition) {
						case 'hd':
							// HD aspect ratio is 16:9.
							// https://en.wikipedia.org/wiki/High-definition_television
							video.width = 1920
							video.height = 1080
							break
						case 'sd':
							// SD aspect ratio is 4:3.
							// https://en.wikipedia.org/wiki/Standard-definition_television
							video.width = 1440
							video.height = 1080
							break
					}
					return video
				}
			)
		}
	)
}

// Copied from:
// https://stackoverflow.com/questions/22148885/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-javascript-no
function parseISO8601Duration(duration) {
	const match = duration.match(/P(\d+Y)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/)
	// An invalid case won't crash the app.
	if (!match) {
		// I've seen YouTube video duration "P0D": that was weird.
		console.error(`Invalid YouTube video duration: ${duration}`)
		return 0
	}
	const [
		years,
		weeks,
		days,
		hours,
		minutes,
		seconds
	] = match.slice(1).map(_ => _ ? Number(_.replace(/\D/, '')) : 0)
  return (((years * 365 + weeks * 7 + days) * 24 + hours) * 60 + minutes) * 60 + seconds
}

if (parseISO8601Duration('PT1H') !== 3600) {
	throw new Error()
}

if (parseISO8601Duration('PT23M') !== 1380) {
	throw new Error()
}

if (parseISO8601Duration('PT45S') !== 45) {
	throw new Error()
}

if (parseISO8601Duration('PT1H23M') !== 4980) {
	throw new Error()
}

if (parseISO8601Duration('PT1H45S') !== 3645) {
	throw new Error()
}

if (parseISO8601Duration('PT1H23M45S') !== 5025) {
	throw new Error()
}

if (parseISO8601Duration('P43W5DT5M54S') !== 26438754) {
	throw new Error()
}

if (parseISO8601Duration('P1Y43W5DT5M54S') !== 57974754) {
	throw new Error()
}

function toArray(anything) {
	return Array.isArray(anything) ? anything : [anything]
}

// Alternative domains:
// * `i.ytimg.com`
// * `i3.ytimg.com`
export function getPictureSizeUrl(id, sizeName) {
	return `https://img.youtube.com/vi/${id}/${sizeName}.jpg`
}

export const PREVIEW_PICTURE_SIZES = [
	// 1280 x 720.
	// HD aspect ratio.
	{
		name: 'maxresdefault',
		width: 1280,
		height: 720
	},
	// 640 x 480.
	// non-HD aspect ratio.
	{
		name: 'sddefault',
		width: 640,
		height: 480
	},
	// Many videos don't have `maxresdefault`/`sddefault`.
	// 480 x 360.
	{
		name: 'hqdefault',
		width: 629,
		height: 472
	},
	// The smallest one.
	// 320 x 180.
	{
		name: 'mqdefault',
		width: 320,
		height: 180
	}
]

// A YouTube preview stub image when a preview size is not present.
const PREVIEW_NOT_FOUND_PICTURE_SIZE = {
	width: 120,
	height: 90
}