/*
  REFERENCE:
    - Upstash Redis XREAD (2026). Available at: https://upstash.com/docs/redis/sdks/ts/commands/stream/xread
*/

import { redis } from "../config/ws.redis.config.js";

export class WSRedisRepository {

    async readStream(streamKey, lastId = '0-0', count = 10) {
        try {
          console.log("streamKey: " + streamKey);
          const redisData = await redis.xread(streamKey, lastId, { count });
          // const redisData = await redis.xread(streamKey, $); // reading only latest data (from upstash docs)
          return redisData;
        } catch (err) {
          console.error("Error in readStream:", err);
          return null;
        }
      }
}