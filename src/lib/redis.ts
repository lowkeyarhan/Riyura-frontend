import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return "redis://localhost:6379";
};

const redis = new Redis(getRedisUrl());

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redis.on("connect", () => {
  console.log("Redis Client Connected");
});

export default redis;
