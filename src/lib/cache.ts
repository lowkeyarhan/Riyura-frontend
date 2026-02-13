import redis from "./redis";

type CacheOptions = {
  ttl?: number; // Time to live in seconds
};

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = { ttl: 86400 }, // Default 24 hours
): Promise<T> {
  const { ttl } = options;

  try {
    // 1. Check Cache
    const cachedData = await redis.get(key);

    if (cachedData) {
      console.log(`[CACHE HIT] ${key}`);
      return JSON.parse(cachedData) as T;
    }

    console.log(`[CACHE MISS] ${key}`);

    // 2. Fetch Data
    const data = await fetcher();

    // 3. Cache Data
    if (data) {
      console.log(`[CACHE PUT] ${key} (TTL: ${ttl}s)`);
      // Use setex for atomic set + expire
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(data));
      } else {
        await redis.set(key, JSON.stringify(data));
      }
    }

    return data;
  } catch (error) {
    console.error(`[CACHE ERROR] ${key}`, error);
    // Fallback to fetching data directly if cache fails
    return fetcher();
  }
}

// Helper to manually invalidate cache
export async function invalidateCache(key: string) {
  try {
    await redis.del(key);
    console.log(`[CACHE EVICT] ${key}`);
  } catch (error) {
    console.error(`[CACHE EVICT ERROR] ${key}`, error);
  }
}

// Helper to manually set cache data
export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = 86400,
) {
  try {
    console.log(`[CACHE PUT] ${key} (TTL: ${ttl}s)`);
    if (ttl) {
      await redis.setex(key, ttl, JSON.stringify(data));
    } else {
      await redis.set(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`[CACHE SET ERROR] ${key}`, error);
  }
}

// Helper to manually get cache data (without fetcher)
export async function getCachedDataOnly<T>(key: string): Promise<T | null> {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      console.log(`[CACHE HIT] ${key}`);
      return JSON.parse(cachedData) as T;
    }
    console.log(`[CACHE MISS] ${key}`);
    return null;
  } catch (error) {
    console.error(`[CACHE GET ERROR] ${key}`, error);
    return null;
  }
}
