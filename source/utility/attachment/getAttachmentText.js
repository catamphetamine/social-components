import getAttachmentTextWithoutSocial from './getAttachmentTextWithoutSocial'
import getSocialText from '../social/getSocialText'

/**
 * Generates attachment textual representation.
 * @param  {object} attachment
 * @param  {object} [messages] — An object of shape `{ picture, video, ... }`.
 * @return {string} [text]
 */
export default function getAttachmentText(attachment, messages) {
	switch (attachment.type) {
		case 'social':
			return getSocialText(attachment.social, messages)
		default:
			return getAttachmentTextWithoutSocial(attachment)
	}
}