export const config = {
  VERSION: process.env.VERSION ?? '',
  HOST: process.env.HOST ?? 'http://localhost',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  VERBOSE: process.env.VERBOSE === 'true',
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? '',
  JWT_ACCESS_TOKEN_NAME: process.env.JWT_ACCESS_TOKEN_NAME ?? 'Authentication',
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET ?? '',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? '5m',
  JWT_REFRESH_TOKEN_NAME: process.env.JWT_REFRESH_TOKEN_NAME ?? 'Refresh',
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET ?? '',
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME ?? '7d',
  SENTRY_ENABLED: process.env.SENTRY_ENABLED === 'true',
  SENTRY_DSN: process.env.SENTRY_DSN ?? '',
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER ?? 'local',
  STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET ?? '',
  STORAGE_S3_ACCESS_KEY_ID: process.env.STORAGE_S3_ACCESS_KEY_ID ?? '',
  STORAGE_S3_SECRET_ACCESS_KEY: process.env.STORAGE_S3_SECRET_ACCESS_KEY ?? '',
  STORAGE_S3_REGION: process.env.STORAGE_S3_REGION ?? '',
  STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT ?? '',
  STORAGE_S3_URL: process.env.STORAGE_S3_URL ?? '',
  FFMPEG_PATH: process.env.FFMPEG_PATH ?? 'ffmpeg',
};
