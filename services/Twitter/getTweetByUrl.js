import parseTweetUrl from './parseTweetUrl.js'
import getTweet from './getTweet.js'

// Returns a `Promise`.
export default function getTweetByUrl(url, { messages }) {
	const { id } = parseTweetUrl(url)
	if (id) {
		return getTweet(id, { messages })
	}
	return Promise.resolve()
}