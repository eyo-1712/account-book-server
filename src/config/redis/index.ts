import { RedisStore } from 'connect-redis'
import * as redis from 'redis'

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})
redisClient.connect()

export const redisStore = new RedisStore({ client: redisClient })
