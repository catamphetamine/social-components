import { getUrlQueryPart } from '../../utility/url.js'

export default function getEmbeddedVideoUrl(id, options = {}) {
	const parameters = {}
	if (options.autoPlay) {
		parameters.autoplay = 1
	}
	if (options.startAt) {
		parameters.start = options.startAt
	}
	return `https://www.youtube.com/embed/${id}${getUrlQueryPart(parameters)}`
}
