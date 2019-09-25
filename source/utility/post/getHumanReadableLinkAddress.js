export default function getHumanReadableLinkAddress(url) {
	try {
		url = decodeURI(url)
	} catch (error) {
		// Sometimes throws "URIError: URI malformed".
		console.error('Couldn\'t parse URL:', url)
		if (error.message.indexOf('URI malformed') < 0) {
			console.error(error)
		}
	}
	return url
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www\.)?/, '')
		// Remove `/` in the end.
		.replace(/\/$/, '')
}