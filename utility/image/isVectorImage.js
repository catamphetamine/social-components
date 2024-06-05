export default function isVectorImage(size) {
	switch (size.type) {
		case 'image/svg+xml':
			return true
		default:
			return false
	}
}