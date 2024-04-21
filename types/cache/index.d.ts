export type ResourceCacheService = 'youtube';

export interface ResourceCacheStorage<Value> {
	get(string: key): Value;
	set(string: key, value: Value);
	delete(string: key);
}

export class ResourceCache<ResourceCacheValue> {
  constructor(storage: ResourceCacheStorage<any>);
	get(service: ResourceCacheService, key: string): ResourceCacheValue | undefined;
	put(service: ResourceCacheService, key: string, value: ResourceCacheValue);
	clear(service: ResourceCacheService);
}