import getYouTubeVideoByUrl from '../../services/YouTube/getVideoByUrl.js'
import parseVideoUrl from '../../services/YouTube/parseVideoUrl.js'

export default {
	parseUrl(url) {
		const { id } = parseVideoUrl(url)
		if (id) {
			return { id, url }
		}
	},
	getId({ id }) {
		return id
	},
	load({ id, url }, { youTubeApiKey }) {
		return getYouTubeVideoByUrl(url, { youTubeApiKey })
	},
	getAttachment(video) {
		// Video description is not currently being output anywhere.
		// Without `description` the `video` size is about 400 bytes.
		// With `description` the `video` size is about 1000 bytes on average.
		// `description` is explicitly deleted here in order to prevent
		// any possible bugs resulting from retrieving the video from local YouTube cache
		// that doesn't store video descriptions.
		delete video.description
		return {
			type: 'video',
			video
		}
	},
	getContent(video) {
		return video.title
	},
	getNotFoundMessage(messages) {
		return messages && messages.videoNotFound
	}
}