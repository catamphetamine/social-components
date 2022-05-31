export default function getPicturesAndVideos(attachments) {
	return attachments.filter(_ => _.type === 'picture' || _.type === 'video')
}