import { getUrlQueryPart } from '../../utility/url'

export default function getEmbeddedVideoUrl(id, options = {}) {
	const parameters = {}
	if (options.color) {
		parameters.color = options.color
	}
	if (options.autoPlay) {
		parameters.autoplay = 1
	}
	if (options.loop) {
		parameters.loop = 1
	}
	return `https://player.vimeo.com/video/${id}${getUrlQueryPart(parameters)}`
}