// import getYouTubeVideoByUrl from '../../services/YouTube/getVideoByUrl.js'
import getYouTubeEmbeddedVideoUrl from '../../services/YouTube/getEmbeddedVideoUrl.js'
import getYouTubeVideoUrl from '../../services/YouTube/getVideoUrl.js'

// import getVimeoVideoByUrl from '../../services/Vimeo/getVideoByUrl.js'
import getVimeoEmbeddedVideoUrl from '../../services/Vimeo/getEmbeddedVideoUrl.js'
import getVimeoVideoUrl from '../../services/Vimeo/getVideoUrl.js'

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

export default function getVideoUrl(id, provider, options) {
	switch (provider) {
		case 'YouTube':
			return getYouTubeVideoUrl(id, options)
		case 'Vimeo':
			return getVimeoVideoUrl(id, options)
		default:
			throw new RangeError(`Unknown video provider: ${provider}`)
	}
}