import { EventStoreDBClient } from '@eventstore/db-client';
import { ENVS } from '../../../../shared/config';

export const eventStoreClient = EventStoreDBClient.connectionString(
  ENVS.EVENT_STORE_DB.URL,
);
