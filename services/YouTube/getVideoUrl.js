import getUrlQueryStringForParameters from '../../utility/getUrlQueryStringForParameters.js'

export default function getVideoUrl(id, options = {}) {
	const parameters = {
		v: id
	}
	if (options.startAt) {
		parameters.start = options.startAt
	}
	return `https://youtube.com/watch${getUrlQueryStringForParameters(parameters)}`
}