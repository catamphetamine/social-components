import { Video } from '../../ContentType.d.js'

export type VideoProvider = 'YouTube' | 'Vimeo';

export interface GetYouTubeVideoUrlOptions {
	startAt?: number;
}

export interface GetYouTubeVideoOptions {
	locale?: string;
	startAt?: number;
	picture?: boolean;
	youTubeApiKey: string;
}

export function parseVideoUrl(url: string): { id: string, startAt?: number };
export function getVideo(id: string, options?: GetYouTubeVideoOptions): Promise<Video | null>;
export function getVideoByUrl(url: string, options?: GetYouTubeVideoOptions): Promise<Video | undefined>;
export function getVideoUrl(id: string, options?: GetYouTubeVideoUrlOptions): string;
export function getEmbeddedVideoUrl(id: string, options?: { autoplay?: boolean, start?: boolean }): string;