// import getYouTubeVideoByUrl from './YouTube/getVideoByUrl.js'
import getYouTubeEmbeddedVideoUrl from './YouTube/getEmbeddedVideoUrl.js'
import getYouTubeVideoUrl from './YouTube/getVideoUrl.js'

// import getVimeoVideoByUrl from './Vimeo/getVideoByUrl.js'
import getVimeoEmbeddedVideoUrl from './Vimeo/getEmbeddedVideoUrl.js'
import getVimeoVideoUrl from './Vimeo/getVideoUrl.js'

export function getEmbeddedVideoUrl(id, provider, options) {
	switch (provider) {
		case 'YouTube':
			return getYouTubeEmbeddedVideoUrl(id, options)
		case 'Vimeo':
			return getVimeoEmbeddedVideoUrl(id, options)
		default:
			throw new RangeError(`Unknown video provider: ${provider}`)
	}
}

export function getVideoUrl(id, provider, options) {
	switch (provider) {
		case 'YouTube':
			return getYouTubeVideoUrl(id, options)
		case 'Vimeo':
			return getVimeoVideoUrl(id, options)
		default:
			throw new RangeError(`Unknown video provider: ${provider}`)
	}
}