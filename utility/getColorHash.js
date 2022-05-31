/**
 * Converts a string to a color.
 * https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
 * @param  {string} string
 * @return {string} Hexademical color (example: "#aabbcc").
 */
export default function getColorHash(string) {
	let hash = 0
	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash)
	}
	let color = '#'
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xFF
		color += ('00' + value.toString(16)).substr(-2)
	}
	return color
}

// Returns too little colors. Won't do.
/*
export default function getColorHash(string, luminance, saturation) {
	return numberToHSL(getHashCode(string), luminance, saturation)
}

function getHashCode(string) {
	if (string.length === 0) {
		return hash
	}
	let hash = 0
	let i = 0
	while (i < string.length) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash)
		hash = hash & hash // Convert to 32bit integer
		i++
	}
	return hash
}

function numberToHSL(number, luminance = 40, saturation = 100) {
	return `hsl(${number % 360},${saturation}%,${luminance}%)`
}
*/