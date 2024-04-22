import { GetYouTubeVideoUrlOptions, GetYouTubeEmbeddedVideoUrlOptions } from './youtube/index.d.js'
// import { GetVimeoVideoUrlOptions, GetVimeoEmbeddedVideoUrlOptions } from './vimeo/index.d.js'

export type VideoProvider = 'YouTube' | 'Vimeo';

export type GetVideoUrlOptions = GetYouTubeVideoUrlOptions;
export type GetEmbeddedVideoUrlOptions = GetYouTubeEmbeddedVideoUrlOptions;

export function getVideoUrl(id: string, provider: VideoProvider, options?: GetVideoUrlOptions): string;
export function getEmbeddedVideoUrl(id: string, provider: VideoProvider, options?: GetEmbeddedVideoUrlOptions): string;