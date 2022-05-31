// These may be passed as `options`.
const LEFT_QUOTE = '«'
const RIGHT_QUOTE = '»'

export default function getAttachmentTextWithoutSocial(attachment) {
	switch (attachment.type) {
		case 'picture':
			if (attachment.picture.title) {
				return LEFT_QUOTE + attachment.picture.title + RIGHT_QUOTE
			}
			break
		case 'video':
			if (attachment.video.title) {
				return LEFT_QUOTE + attachment.video.title + RIGHT_QUOTE
			}
			break
		case 'audio':
			if (attachment.audio.author) {
				return `${attachment.audio.author} — ${LEFT_QUOTE}${attachment.audio.title}${RIGHT_QUOTE}`
			}
			return LEFT_QUOTE + attachment.audio.title + RIGHT_QUOTE
	}
}