export interface RenderTweetOptions {
	darkMode?: boolean;
	locale?: string;
}

export function renderTweet(id: string, container: HTMLElement, options?: RenderTweetOptions): Promise<JSX.Element>;

export type VideoProvider = 'YouTube' | 'Vimeo';

export type GetVideoUrlOptions =
	GetYouTubeVideoUrlOptions |
	GetVimeoVideoUrlOptions;

export interface GetYouTubeVideoUrlOptions {
	locale?: string;
	picture?: boolean;
	startAt?: number;
}

export interface GetVimeoVideoUrlOptions {}

export function getVideoUrl(id: string, provider: VideoProvider, options?: GetVideoUrlOptions): string;

export function getEmbeddedVideoUrl(id: string, provider: VideoProvider, options?: GetVideoUrlOptions): string;