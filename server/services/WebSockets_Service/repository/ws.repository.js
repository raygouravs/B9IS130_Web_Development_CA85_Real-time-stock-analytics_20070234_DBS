import { redis } from "../config/ws.redis.config.js";

export class WSRedisRepository {
    constructor(){
        this.lastIDs = {};
    }

    async readStream(streamKey, lastId = "0-0", count = 10) {
            // const keys = await redis.keys("ticks:*");
            // console.log("All tick streams:", keys);
        try {
          console.log("streamKey: " + streamKey);
          const redisData = await redis.xread(streamKey, lastId, { count });
          return redisData;
        } catch (err) {
          console.error("Error in readStream:", err);
          return null;
        }
      }
}