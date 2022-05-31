import YouTubeVideoCache from './YouTubeVideoCache.js'

export default class ResourceCache {
	constructor({ storage }) {
		this.storage = storage
		this.youTubeVideoCache = new YouTubeVideoCache({ storage })
	}

	get(service, key) {
		switch (service) {
			case 'youtube':
				return this.youTubeVideoCache.get(key)
		}
	}

	put(service, key, value) {
		switch (service) {
			case 'youtube':
				return this.youTubeVideoCache.put(key, value)
		}
	}

	clear(service) {
		if (!service) {
			this.youTubeVideoCache.clear()
			return
		}

		switch (service) {
			case 'youtube':
				return this.youTubeVideoCache.clear()
		}
	}
}