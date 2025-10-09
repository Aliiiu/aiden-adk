export interface ICacheDB {
  createCache(content: string, options?: CacheCreateOptions): Promise<string>;
  getCache(cacheName: string): Promise<any>;
  listCaches(pageSize?: number): Promise<any[]>;
  deleteCache(cacheName: string): Promise<void>;
  updateCache(cacheName: string, ttlSeconds: number): Promise<any>;
  query(cacheName: string, query: string, model?: string): Promise<string>;
}

export interface CacheCreateOptions {
  ttlSeconds?: number;
  systemInstruction?: string;
  displayName?: string;
}

export interface CacheMetadata {
  name: string;
  model: string;
  displayName?: string;
  usageMetadata?: any;
  createTime?: string;
  updateTime?: string;
  expireTime?: string;
}
