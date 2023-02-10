// `getAttachmentText()` already uses `getSocialText()`
// so using `getAttachmentTextWithoutSocial()` here to avoid circular dependency.
import getAttachmentTextWithoutSocial from '../attachment/getAttachmentTextWithoutSocial.js'
import getAttachmentTypeLabel from '../attachment/getAttachmentTypeLabel.js'

// These may be passed as `options`.
const SOCIAL_AUTHOR_AND_CONTENT_TEXT = '{author}: {content}'
const SOCIAL_AUTHOR_NAME_AND_ID_TEXT = '{name} (@{id})'
const SOCIAL_AUTHOR_ID_TEXT = '@{id}'
const SOCIAL_CONTENT_TEXT = '«{content}»'

/**
 * Generates a text-only representation of a `social`.
 * @param  {object} social
 * @param  {object} [messages] — Localized labels. See the description of "Messages" in the readme.
 * @return {string}
 */
export default function getSocialText(social, messages) {
	const author = getSocialAuthorText(social)
	let content = getSocialContentText(social)
	if (!content) {
		content = getSocialAttachmentsText(social, messages)
	}
	if (content) {
		return SOCIAL_AUTHOR_AND_CONTENT_TEXT
			.replace('{author}', author)
			.replace('{content}', content)
	}
	// `author` is supposed to always be present.
	return author
}

function getSocialAuthorText(social) {
	if (social.author.name) {
		if (social.author.id) {
			return SOCIAL_AUTHOR_NAME_AND_ID_TEXT
				.replace('{name}', social.author.name)
				.replace('{id}', social.author.id)
		} else {
			return social.author.name
		}
	} else {
		return SOCIAL_AUTHOR_ID_TEXT
			.replace('{id}', social.author.id)
	}
}

function getSocialContentText(social) {
	if (social.content) {
		return SOCIAL_CONTENT_TEXT.replace('{content}', social.content)
	}
}

function getSocialAttachmentsText(social, messages) {
	if (social.attachments) {
		for (const attachment of social.attachments) {
			const text = getAttachmentTextWithoutSocial(attachment)
			if (text) {
				return text
			}
		}
		if (messages) {
			for (const attachment of social.attachments) {
				const label = getAttachmentTypeLabel(attachment, messages)
				if (label) {
					return label
				}
			}
		}
	}
}