import { Redis as IoRedis } from 'ioredis';

export const redisSaddMock = jest
  .spyOn(IoRedis.prototype, 'sadd')
  .mockImplementation(() => Promise.resolve(1));
export const redisSetMock = jest
  .spyOn(IoRedis.prototype, 'set')
  .mockImplementation(() => Promise.resolve('OK'));
export const redisDelMock = jest
  .spyOn(IoRedis.prototype, 'del')
  .mockImplementation(() => Promise.resolve(1));
export const redisSremMock = jest
  .spyOn(IoRedis.prototype, 'srem')
  .mockImplementation(() => Promise.resolve(1));
export const redisSmembersMock = jest
  .spyOn(IoRedis.prototype, 'smembers')
  .mockImplementation(() => Promise.resolve([]));
