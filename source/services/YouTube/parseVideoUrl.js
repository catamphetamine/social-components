export default function parseVideoUrl(url) {
	// Get video ID.
	let id
	let startAt
	const location = new URL(url)
	if (location.hostname === 'www.youtube.com' || location.hostname === 'm.youtube.com') {
		if (location.search) {
			id = location.searchParams.get('v')
			if (location.searchParams.get('t')) {
				startAt = parseInt(location.searchParams.get('t'))
			}
		}
	} else if (location.hostname === 'youtu.be') {
		id = location.pathname.slice('/'.length)
		if (location.searchParams.get('t')) {
			startAt = parseInt(location.searchParams.get('t'))
		}
	}
	return {
		id,
		startAt
	}
}