import fetchJsonp from 'fetch-jsonp'

// Returns a `Promise`.
export default function(url, { callbackFunction }) {
	return fetchJsonp(url, {
		jsonpCallbackFunction: callbackFunction
	})
}