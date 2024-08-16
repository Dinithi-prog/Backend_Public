import {Logger, Module, NotAcceptableException} from '@nestjs/common';
import {ConfigModule as NestConfigModule} from '@nestjs/config';
import {validateSync} from 'class-validator';
import {MongoDBDatabaseModule} from './database/database.module';
import {EnvironmentConfig} from '@shared/models/env/environment-config.model';

@Module({
  imports: [
    /**
     * Validate and make the ConfigService available across the application
     */
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: config => {
        const logger = new Logger(ConfigModule.name);

        const environmentConfig = new EnvironmentConfig();

        Object.assign(environmentConfig, config);

        logger.log(`Validating environment variables`);

        const results = validateSync(environmentConfig, {
          forbidUnknownValues: false,
        });

        if (results.length > 0) {
          console.log('test');

          throw new NotAcceptableException(
            results.map(value => value.toString(false)).join(','),
            'Invalid environment variable config',
          );
        }

        logger.log(`Environment variables validated`);

        return environmentConfig;
      },
    }),
    MongoDBDatabaseModule,
  ],
})
export class ConfigModule {}
