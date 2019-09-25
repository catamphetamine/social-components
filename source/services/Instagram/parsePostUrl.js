export default function parsePostUrl(url) {
	const match = url.match(/\/p\/([a-zA-Z\d]+)/)
	if (match) {
		return {
			id: match[1]
		}
	}
	return {}
}