import { Social } from '../../SocialAttachment.d.js';

export function getTweet(id: string, options?: { messages?: object }): Promise<Social | undefined>;
export function getTweetByUrl(url: string): Promise<Social | undefined>;
export function getTweetText(html: string, options?: { messages?: object }): Promise<string | undefined>;
export function parseTweetUrl(url: string): { id?: string };

export interface RenderTweetOptions {
	darkMode?: boolean;
	locale?: string;
}

export function renderTweet(id: string, container: HTMLElement, options?: RenderTweetOptions): Promise<JSX.Element>;
