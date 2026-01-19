import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { DAYS } from '../../config/constants.js';
import { isEmpty } from '../utils/data.helper.js';

@Injectable()
export class CacheManagerService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async hset(key: string, hashKey: string, value: any, expiredIn = 1 * DAYS) {
    return await this.redis.hset(
      key,
      hashKey,
      JSON.stringify(value),
      'EX',
      expiredIn,
    );
  }

  async hget(key: string, hashKey: string) {
    return await this.redis.hget(key, hashKey);
  }

  async set(key: string, value: any, expiredIn = 1 * DAYS) {
    try {
      return await this.redis.set(key, JSON.stringify(value), 'EX', expiredIn);
    } catch (error) {
      console.error(
        `${new Date().toString()} set cache error: ${error} - key: ${key} - value: ${JSON.stringify(value)}`,
      );
    }
  }

  async sadd(
    key: string,
    value: string | number | Buffer | string[],
    expiredIn = 1 * DAYS,
  ) {
    if (Array.isArray(value)) {
      await this.redis.sadd(key, ...value);
    } else {
      await this.redis.sadd(key, value);
    }
    await this.redis.expire(key, expiredIn);
  }

  async get(key: string) {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error(
        `${new Date().toString()} get cache error: ${error} - key: ${key}`,
      );
      return null;
    }
  }

  async del(key: string) {
    return await this.redis.del(key);
  }

  async findOrCache<T>(
    func: () => Promise<T>,
    key: string,
    expiredTime = 1 * DAYS,
  ): Promise<T | null> {
    const cachedData = await this.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    const data = await func();
    if (data && !isEmpty(data)) {
      await this.set(key, data, expiredTime);
    }

    return data;
  }

  async findSmembersOrCache(
    func: () => Promise<string[]>,
    key: string,
    expiredTime = 1 * DAYS,
  ): Promise<string[]> {
    const cachedData = await this.redis.smembers(key);
    // default smembers return empty array if key not found => if empty array don't return cached data
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }

    const data = await func();
    if (data && data.length > 0) {
      await this.sadd(key, data, expiredTime);
    }

    return data;
  }
}
