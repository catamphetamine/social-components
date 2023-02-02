export default {
	name: 'facebook',
	services: [{
		domains: ['facebook.com'],
		getLinkTitle(url) {
			if (url.pathname === '/profile.php' && url.searchParams.get('id')) {
				return url.searchParams.get('id')
			}
			const peopleMatch = url.pathname.match(/^\/people\/(.+?)\//)
			if (peopleMatch) {
				return peopleMatch[1]
			}
		}
	}]
}