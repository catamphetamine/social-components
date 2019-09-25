export default function resolvePromises(promises, onPartialResolve) {
	return new Promise((resolve, reject) => {
		const results = new Array(promises.length)
		let countdown = promises.length
		let i = 0
		while (i < promises.length) {
			const promise = promises[i]
			// A "closure" is required in order for `i` to be correct.
			function trackPromise(i) {
				promise.then((result) => {
					results[i] = result
					countdown--
					onPartialResolve(result)
					if (countdown === 0) {
						resolve(results)
					}
				}, reject)
			}
			trackPromise(i)
			i++
		}
	})
}