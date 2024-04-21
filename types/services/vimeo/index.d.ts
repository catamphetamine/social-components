import { Video } from '../../ContentType.d.js'

export interface GetVimeoEmbeddedVideoUrlOptions {
	color?: string;
	autoPlay?: boolean;
	loop?: boolean;
}

export function getVideo(id: string): Promise<Video>;
export function getVideoByUrl(url: string): Promise<Video | undefined>;
export function getVideoUrl(id: string): string;
export function getEmbeddedVideoUrl(id: string, options?: GetVimeoEmbeddedVideoUrlOptions): string;