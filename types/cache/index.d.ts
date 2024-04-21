export type ResourceCacheService = 'youtube';

export interface ResourceCacheStorage<Value> {
	get(key: string): Value;
	set(key: string, value: Value): void;
	delete(key: string): void;
}

export class ResourceCache<ResourceCacheValue> {
  constructor(storage: ResourceCacheStorage<any>);
	get(service: ResourceCacheService, key: string): ResourceCacheValue | undefined;
	put(service: ResourceCacheService, key: string, value: ResourceCacheValue): void;
	clear(service: ResourceCacheService): void;
}