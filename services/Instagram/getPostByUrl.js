import parsePostUrl from './parsePostUrl.js'
import getPost from './getPost.js'

// Returns a `Promise`.
export default function getPostByUrl(url, { messages }) {
	const { id } = parsePostUrl(url)
	if (id) {
		return getPost(id, { messages })
	}
	return Promise.resolve()
}