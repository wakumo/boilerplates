import { registerAs } from '@nestjs/config';

// Sample config
export const SampleConfig = registerAs('sample', () => ({
  name: process.env.SAMPLE_NAME,
}));

// Database config
export const DatabaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  userName: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  nameTest: process.env.DB_NAME_TEST,
  loggerOptions:
    process.env.ENV_NAME === 'development'
      ? true
      : ['warn', 'error', 'migration'],
  slowLimit: Number(process.env.DB_SLOW_LIMIT) || 500, // ms
}));

// Redis config
export const RedisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
}));

// RabbitMQ config
export const RabbitmqConfig = registerAs('rabbitmq', () => ({
  host: process.env.RABBITMQ_HOST,
  port: Number(process.env.RABBITMQ_PORT) || 5672,
  user: process.env.RABBITMQ_USER ?? 'guest',
  pass: process.env.RABBITMQ_PASS ?? 'guest',
  exchange: {
    name: process.env.RABBITMQ_EXCHANGE_NAME,
    dlx: `${process.env.RABBITMQ_EXCHANGE_NAME}-dlx`,
  },
}));

// AWS config
export const AwsConfig = registerAs('aws', () => ({
  bucket: process.env.AWS_BUCKET,
}));

// Slack config
export const SlackConfig = registerAs('slack', () => ({
  webhookUrl: process.env.SLACK_NOTIFICATION_URL,
}));

// JWT config
export const JwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
}));

// Export all configs as a single array for easy module registration
export const configurations = [
  SampleConfig,
  DatabaseConfig,
  RedisConfig,
  RabbitmqConfig,
  AwsConfig,
  SlackConfig,
  JwtConfig,
];
