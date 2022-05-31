import isPostLinkQuote from './isPostLinkQuote.js'

export default function isPostLinkBlockQuote(postLink) {
	return isPostLinkQuote(postLink) && postLink.content[0].block
}