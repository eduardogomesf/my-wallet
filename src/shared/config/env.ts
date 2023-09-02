import { config } from 'dotenv';

config();

export const ENVS = {
  APP: {
    PORT: process.env.APP_PORT || 8080,
  },
  EVENT_STORE_DB: {
    URL: process.env.EVENT_STORE_DB_URL || 'esdb://localhost:2113?tls=false',
  },
} as const;
