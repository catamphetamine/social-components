export interface Messages {
	videoNotFound: string,
	textContent: {
		block: {
			picture: string,
			video: string,
			audio: string,
			attachment: string
		},
		inline: {
			attachment: string,
			link: string,
			linkTo: string
		}
	}
}

declare const messages: Messages
export default messages