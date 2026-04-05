/*
    REFERENCES: 
    - Redis XADD. Available at: https://redis.io/docs/latest/commands/xadd/
*/

import { redis } from '../config/redis.js';

export class RedisRepository {
//   async addToStream(streamName, data, limit = 1000) {
//     return await redis.xadd(streamName, {
//       maxlen: { threshold: limit, current: false }, 
//       id: '*',
//       data: data
//     });
//   }

  async addToStream(streamName, data, limit = 1000) {
  
    if (!data || typeof data !== 'object') {
        console.error(`Cannot add to stream ${streamName}: invalid data`, data);
        return;
    }

    return await redis.xadd(
        streamName,
        '*',              
        data,     
        { maxlen: { threshold: limit } }
    );
   }

}