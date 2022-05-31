export default function isPostLinkGeneratedQuote(postLink) {
	return Array.isArray(postLink.content) && postLink.content[0].type === 'quote' && postLink.content[0].generated
}