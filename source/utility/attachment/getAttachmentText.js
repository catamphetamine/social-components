import getAttachmentTextWithoutSocial from './getAttachmentTextWithoutSocial'
import getSocialText from '../social/getSocialText'

export default function getAttachmentText(attachment, messages) {
	switch (attachment.type) {
		case 'social':
			return getSocialText(attachment.social, messages)
		default:
			return getAttachmentTextWithoutSocial(attachment)
	}
}