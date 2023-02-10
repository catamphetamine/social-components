import getAttachmentTextWithoutSocial from './getAttachmentTextWithoutSocial.js'
import getSocialText from '../social/getSocialText.js'

/**
 * Generates attachment textual representation.
 * @param  {object} attachment
 * @param  {object} [messages] — Localized labels. See the description of "Messages" in the readme.
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