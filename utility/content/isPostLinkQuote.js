export default function isPostLinkQuote(postLink) {
	return Array.isArray(postLink.content) && postLink.content[0].type === 'quote'
}