import { Redis } from '@upstash/redis';

const UPSTASH_REDIS_REST_URL="https://accurate-unicorn-91780.upstash.io"
const UPSTASH_REDIS_REST_TOKEN="gQAAAAAAAWaEAAIncDFiYTg1NzIxN2U0ZWM0ZWNhODNhODBjY2IwZDMxNDkxNHAxOTE3ODA"

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN
});

