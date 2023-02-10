// These may be passed as `options`.
const ATTACHMENT_WITH_TITLE_TEXT = '«{title}»'
const ATTACHMENT_WITH_AUTHOR_AND_TITLE_TEXT = '{author} — «{title}»'

export default function getAttachmentTextWithoutSocial(attachment) {
	switch (attachment.type) {
		case 'picture':
			if (attachment.picture.title) {
				return ATTACHMENT_WITH_TITLE_TEXT.replace('{title}', attachment.picture.title)
			}
			break
		case 'video':
			if (attachment.video.title) {
				return ATTACHMENT_WITH_TITLE_TEXT.replace('{title}', attachment.video.title)
			}
			break
		case 'audio':
			if (attachment.audio.title) {
				if (attachment.audio.author) {
					return ATTACHMENT_WITH_AUTHOR_AND_TITLE_TEXT
						.replace('{author}', attachment.audio.author)
						.replace('{title}', attachment.audio.title)
				}
				return ATTACHMENT_WITH_TITLE_TEXT.replace('{title}', attachment.audio.title)
			}
	}
}