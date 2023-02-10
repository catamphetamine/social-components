/**
 * Returns a more human-friendly link address:
 * strips "http(s):" protocol and the "www." part,
 * removes a trailing slash.
 * @param  {string} url
 * @return {string}
 */
export default function getHumanReadableLinkAddress(url) {
	try {
		// Decode URL characters.
		//
		// When a user copies or "shares" a page's URL
		// in a web browser or in some other application,
		// it usually gets copied or sent in an "encoded form".
		// For example, all spaces get replaced by "%20", etc.
		//
		url = decodeURI(url)
	} catch (error) {
		// Sometimes throws "URIError: URI malformed".
		console.error('Couldn\'t parse URL:', url)
		if (error.message.indexOf('URI malformed') < 0) {
			console.error(error)
		}
	}

	const humanReadableUrl = url
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www\.)?/, '')
		// Remove `/` at the end.
		.replace(/\/$/, '')

	if (humanReadableUrl) {
		return humanReadableUrl
	}

	return url
}