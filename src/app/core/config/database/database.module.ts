import {Module, Logger} from '@nestjs/common';
import {MongoClient} from 'mongodb';
import {ConfigService, ConfigModule as NestConfigModule} from '@nestjs/config';
import {DatabaseModule} from './database.config';

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(DatabaseModule.name);

        logger.log('Connecting to MongoDB');

        const DATABASE_CONNECTION_STRING = configService.get('DATABASE_CONNECTION_STRING');
        const DATABASE_NAME = configService.get('DATABASE_NAME');

        const client = await new MongoClient(DATABASE_CONNECTION_STRING).connect();

        logger.log('MongoDB connected..');

        const database = client.db(DATABASE_NAME, {
          ignoreUndefined: true,
        });

        logger.log(`Successfully connected to ${database.databaseName} database`);

        return database;
      },
    }),
  ],
})
export class MongoDBDatabaseModule {}
