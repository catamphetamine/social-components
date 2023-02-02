export default {
	name: 'vk',
	services: [{
		domains: ['vk.com'],
		getLinkTitle(url) {
			if (SINGLE_PATH_ELEMENT.test(url.pathname)) {
				return url.pathname.slice('/'.length).replace(/^id/, '')
			}
		}
	}]
}

const SINGLE_PATH_ELEMENT = /^\/[^\/]+$/
