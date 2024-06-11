export default {
	name: 'vk',
	services: [{
		domains: ['vk.com'],
		getLinkTitle(url) {
			// Match `/{username}` URL.
			if (SINGLE_PATH_ELEMENT.test(url.pathname)) {
				return url.pathname.slice('/'.length).replace(/^id/, '')
			}
		}
	}]
}

const SINGLE_PATH_ELEMENT = /^\/[^\/]+$/
