/**
 * "Last Recently Used" cache.
 * The "recency" is stored in the sorted list of "${prefix}:keys"
 * while values are stored separately as "${prefix}:entries".
 */
export default class LRUCache {
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
		// Update keys order (by recency).
		keys.splice(index, 1)
		keys.push(key)
		// Save keys order.
		this.storage.set(this.prefix + ':keys', keys)
		// Get the value.
		const entries = this.storage.get(this.prefix + ':entries')
		return entries[key]
	}

	set(key, value) {
		const keys = this.storage.get(this.prefix + ':keys') || []
		const entries = this.storage.get(this.prefix + ':entries') || {}
		const index = keys.findIndex(_ => _ === key)
		if (index >= 0) {
			// Mark the key as "recently used".
			keys.splice(index, 1)
		} else {
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