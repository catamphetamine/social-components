import parseServiceLink from './parseServiceLink'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress'

/**
 * Creates post link from `url` and `content`
 * @param  {string} url
 * @param  {string} [content]
 * @return {object}
 */
export default function createLink(url, content) {
	const parsedServiceLink = parseServiceLink(url)
	if (content && content !== url) {
		const link = {
			type: 'link',
			url,
			content
		}
		if (parsedServiceLink) {
			link.service = parsedServiceLink.service
		}
		return link
	}
	if (parsedServiceLink) {
		return {
			type: 'link',
			url,
			service: parsedServiceLink.service,
			content: parsedServiceLink.text,
			contentGenerated: true
		}
	}
	return {
		type: 'link',
		url,
		content: getHumanReadableLinkAddress(url) || url,
		contentGenerated: true
	}
}