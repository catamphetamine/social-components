import { GetYouTubeVideoUrlOptions } from './youtube/index.d.js'
// import { GetVimeoVideoUrlOptions } from './vimeo/index.d.js'

export type VideoProvider = 'YouTube' | 'Vimeo';

export type GetVideoUrlOptions = GetYouTubeVideoUrlOptions;

export function getVideoUrl(id: string, provider: VideoProvider, options?: GetVideoUrlOptions): string;
export function getEmbeddedVideoUrl(id: string, provider: VideoProvider, options?: GetVideoUrlOptions): string;