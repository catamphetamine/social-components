import countTextBlockCharacters, { AVERAGE_LINE_CHARACTERS } from '../content/countTextBlockCharacters.js'

const EMBEDDED_ATTACHMENT_COST = AVERAGE_LINE_CHARACTERS * 3
const EMBEDDED_PICTURE_COST = AVERAGE_LINE_CHARACTERS * 6
const EMBEDDED_VIDEO_COST = AVERAGE_LINE_CHARACTERS * 6
const EMBEDDED_AUDIO_COST = AVERAGE_LINE_CHARACTERS * 2

export default function getAttachmentCharacterPoints(attachment) {
	switch (attachment.type) {
		case 'picture':
			return EMBEDDED_PICTURE_COST
		case 'video':
			return EMBEDDED_VIDEO_COST
		case 'audio':
			return EMBEDDED_AUDIO_COST
		case 'social':
			const social = attachment.social
			let points = EMBEDDED_ATTACHMENT_COST
			if (social.author.id) {
				points += countTextBlockCharacters(social.author.id, 'points')
			}
			if (social.author.name) {
				points += countTextBlockCharacters(social.author.name, 'points')
			}
			if (social.content) {
				points += countTextBlockCharacters(social.content, 'points')
			}
			if (social.attachments) {
				for (const attachment of social.attachments) {
					points += getAttachmentCharacterPoints(attachment)
				}
			}
			return points
		default:
			return EMBEDDED_ATTACHMENT_COST
	}
}