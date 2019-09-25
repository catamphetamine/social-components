export default function parseTweetUrl(url) {
	const match = url.match(/\/status\/(\d+)/)
	if (match) {
		return {
			id: match[1]
		}
	}
	return {}
}
