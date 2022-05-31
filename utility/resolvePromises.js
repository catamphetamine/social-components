/**
 * Waits for a list of promises.
 * @param  {Promise[]} promises
 * @param  {function} onPartialResolve — Is called when one of the promises resolves. The argument is gonna be the value the promise resolves to.
 * @return {Promise} A `Promise` that resolves with an array of the promises' "results". When a promise rejects, its "result" will be an object having an `error` property. When a promise resolves, its "result" will be an object having a `result` property.
 */
export default function resolvePromises(promises, onPartialResolve) {
	return new Promise((resolve, reject) => {
		const results = new Array(promises.length)
		let countdown = promises.length
		let i = 0
		while (i < promises.length) {
			const promise = promises[i]
			// A "closure" is required in order for `i` to be correct.
			// Otherwise, `i` would be equal to `promises.length - 1`
			// for every `promise` (javascript quirks).
			function trackPromise(i) {
				promise.then(
					(result) => {
						results[i] = { result }
						onPartialResolve(result)
						countdown--
						if (countdown === 0) {
							resolve(results)
						}
					},
					(error) => {
						results[i] = { error }
						countdown--
						if (countdown === 0) {
							resolve(results)
						}
					}
				)
			}
			trackPromise(i)
			i++
		}
	})
}