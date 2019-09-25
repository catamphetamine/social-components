export default function getMinSize(picture) {
	return picture.sizes && picture.sizes[0] || picture
}