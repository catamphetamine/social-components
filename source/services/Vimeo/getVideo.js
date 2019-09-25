import getImageSize from '../../utility/image/getImageSize'

export default async function getVideo(id) {
	const response = await fetch(`http://vimeo.com/api/v2/video/${id}.json`)
	const data = (await response.json())[0]
	return {
		title: data.title,
		description: data.description,
		width: data.width,
		height: data.height,
		duration: data.duration,
		provider: 'Vimeo',
		id,
		picture: {
			type: 'image/jpeg',
			url: data.thumbnail_large,
			...(await getImageSize(data.thumbnail_large))
		}
	}
}