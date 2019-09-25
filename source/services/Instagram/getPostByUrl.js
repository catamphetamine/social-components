import parsePostUrl from './parsePostUrl'
import getPost from './getPost'

export default async function getPostByUrl(url, { messages }) {
	const { id } = parsePostUrl(url)
	if (id) {
		return await getPost(id, { messages })
	}
}