import getImageSize from '../../utility/image/getImageSize.js'

// Returns a `Promise`.
export default function getVideo(id) {
	return fetch(`http://vimeo.com/api/v2/video/${id}.json`).then(
		(response) => {
			return response.json().then(
				(json) => {
					const data = json[0]
					getImageSize(data.thumbnail_large).then(
						(imageSize) => {
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
									...imageSize
								}
							}
						}
					)
				}
			)
		}
	)
}