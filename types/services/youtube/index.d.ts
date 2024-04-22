import { Video } from '../../ContentType.d.js'

export interface GetYouTubeVideoUrlOptions {
	startAt?: number;
}

export interface GetYouTubeEmbeddedVideoUrlOptions {
	autoPlay?: boolean;
	startAt?: number;
}

export interface GetYouTubeVideoOptions {
	locale?: string;
	startAt?: number;
	picture?: false;
	youTubeApiKey?: string;
}

export function parseVideoUrl(url: string): { id: string, startAt?: number };
export function getVideo(id: string, options?: GetYouTubeVideoOptions): Promise<Video | null>;
export function getVideoByUrl(url: string, options?: GetYouTubeVideoOptions): Promise<Video | null | undefined>;
export function getVideoUrl(id: string, options?: GetYouTubeVideoUrlOptions): string;
export function getEmbeddedVideoUrl(id: string, options?: GetYouTubeEmbeddedVideoUrlOptions): string;