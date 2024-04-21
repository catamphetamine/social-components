export default function getPictureMinSize(picture) {
	return picture.sizes && picture.sizes[0] || picture
}