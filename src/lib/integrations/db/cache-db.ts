import { google } from "@ai-sdk/google";
import { GoogleGenAI, createUserContent } from "@google/genai";
import { generateText, generateObject } from "ai";
import { CacheCreateOptions, CacheMetadata, ICacheDB } from "./_schema";
import z from "zod";


export class CacheDB implements ICacheDB {
  private readonly genAI: GoogleGenAI;
  private readonly defaultModel: string;
  private readonly defaultTTL: number;

  constructor(apiKey: string, model = "gemini-2.0-flash-001", defaultTTL = 3600) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.defaultModel = model;
    this.defaultTTL = defaultTTL;
  }

  /**
   * Create a cache from text content.
   */
  async createCache(content: string, options?: CacheCreateOptions) {
    const cache = await this.genAI.caches.create({
      model: this.defaultModel,
      config: {
        contents: createUserContent(content),
        ttl: `${options?.ttlSeconds || this.defaultTTL}s`,
        displayName: options?.displayName,
        systemInstruction: options?.systemInstruction,
      },
    });

    console.log("Cache created:", cache.name);
    if (!cache.name) throw new Error("Cache creation failed");
    return cache.name;
  }

  /**
   * Get cache metadata.
   */
  async getCache(cacheName: string) {
    return await this.genAI.caches.get({ name: cacheName });
  }

  /**
   * List available caches (with pagination).
   */
  async listCaches(pageSize = 10) {
    const pager = await this.genAI.caches.list({ config: { pageSize } });
    const caches: CacheMetadata[] = [];

    let page = pager.page;
    while (true) {
      for (const cache of page) {
        if (!cache?.name) continue;
        caches.push({
          ...cache,
          name: cache.name,
          model: cache.model ?? this.defaultModel,
        });
      }
      if (!pager.hasNextPage()) break;
      page = await pager.nextPage();
    }

    return caches;
  }

  /**
   * Delete a cache.
   */
  async deleteCache(cacheName: string){
    await this.genAI.caches.delete({ name: cacheName });
    console.log("Cache deleted:", cacheName);
  }

  /**
   * Update cache TTL.
   */
  async updateCache(cacheName: string, ttlSeconds: number) {
    const cache = await this.genAI.caches.update({
      name: cacheName,
      config: { ttl: `${ttlSeconds}s` },
    });
    return cache;
  }

  /**
   * Query cached content using Vercel AI SDK.
   */
  async query(cacheName: string, query: string, model?: string) {
    const { text } = await generateText({
      model: google(model || this.defaultModel),
      prompt: query,
      providerOptions: {
        google: {
          cachedContent: cacheName,
        },
      },
    });
    return text;
  }

  /**
   * Query cached content as structured data using a Zod schema.
   */
  async queryStructured(cacheName: string, query: string, schema: z.ZodTypeAny, model?: string) {
    const result = await generateObject({
      model: google(model || this.defaultModel),
      prompt: query,
      schema,
      providerOptions: {
        google: {
          cachedContent: cacheName,
        },
      },
    });

    return result;
  }

}
