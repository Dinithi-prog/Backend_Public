import {Global, Module, Provider, DynamicModule} from '@nestjs/common';

import {Database} from './database.model';
import {DatabaseModuleOptions} from './database-module-options';
import {DATABASE_MODULE_OPTIONS} from '@core/constants/database-constants';

@Global()
@Module({})
export class DatabaseModule {
  private static createDatabaseProvider(): Provider {
    return {
      provide: Database,
      useFactory: (database: Database) => database,
      inject: [DATABASE_MODULE_OPTIONS],
    };
  }

  static forRootAsync(options: DatabaseModuleOptions): DynamicModule {
    const provider: Provider = {
      provide: DATABASE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const service = this.createDatabaseProvider();

    return {
      global: true,
      module: DatabaseModule,
      imports: options.imports,
      providers: [provider, service],
      exports: [Database],
    };
  }
}
