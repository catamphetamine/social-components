export default class FIFOCache {
	constructor({ maxSize, prefix, storage }) {
		this.maxSize = maxSize
		this.prefix = prefix
		this.storage = storage
	}

	get(key) {
		// See if the key exists.
		const keys = this.storage.get(this.prefix + ':keys') || []
		const index = keys.indexOf(key)
		if (index < 0) {
			return
		}
		const entries = this.storage.get(this.prefix + ':entries')
		return entries[key]
	}

	set(key, value) {
		const keys = this.storage.get(this.prefix + ':keys') || []
		const entries = this.storage.get(this.prefix + ':entries') || {}
		const index = keys.findIndex(_ => _ === key)
		if (index < 0) {
			// Clean up old entries.
			while (keys.length >= this.maxSize) {
				const expiredKey = keys.shift()
				delete entries[expiredKey]
			}
		}
		// Add the key.
		keys.push(key)
		// Add the value.
		entries[key] = value
		// Update keys list.
		this.storage.set(this.prefix + ':keys', keys)
		// Update values.
		this.storage.set(this.prefix + ':entries', entries)
	}

	clear() {
		this.storage.delete(this.prefix + ':keys')
		this.storage.delete(this.prefix + ':entries')
	}
}