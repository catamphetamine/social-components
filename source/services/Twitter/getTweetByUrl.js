import parseTweetUrl from './parseTweetUrl'
import getTweet from './getTweet'

export default async function getTweetByUrl(url, { messages }) {
	const { id } = parseTweetUrl(url)
	if (id) {
		return await getTweet(id, { messages })
	}
}