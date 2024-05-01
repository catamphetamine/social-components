export type ResourceCacheService = 'youtube';

export interface ResourceCacheStorage<Value> {
	get(key: string): Value;
	set(key: string, value: Value): void;
	delete(key: string): void;
}

export class ResourceCache<Value> {
  constructor(parameters: { storage: ResourceCacheStorage<any> });
	get(service: ResourceCacheService, key: string): Value | undefined;
	put(service: ResourceCacheService, key: string, value: Value): void;
	clear(service: ResourceCacheService): void;
}