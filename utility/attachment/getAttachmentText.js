import getAttachmentTextWithoutSocial from './getAttachmentTextWithoutSocial.js'
import getSocialText from '../social/getSocialText.js'

/**
 * Generates attachment textual representation.
 * @param  {object} attachment
 * @param  {object} [contentTypeLabels] — An object of shape `{ picture: "Picture", video: "Video", ... }`.
 * @return {string} [text]
 */
export default function getAttachmentText(attachment, contentTypeLabels) {
	switch (attachment.type) {
		case 'social':
			return getSocialText(attachment.social, contentTypeLabels)
		default:
			return getAttachmentTextWithoutSocial(attachment)
	}
}