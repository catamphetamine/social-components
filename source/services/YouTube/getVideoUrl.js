export default function getVideoUrl(id, options = {}) {
	const parameters = {
		v: id
	}
	if (options.startAt) {
		parameters.start = options.startAt
	}
	return `https://youtube.com/watch${getUrlQueryPart(parameters)}`
}