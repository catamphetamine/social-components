import isPostLinkQuote from './isPostLinkQuote.js'

export default function isPostLinkGeneratedQuote(postLink) {
	return isPostLinkQuote(postLink) && postLink.content[0].contentGenerated
}