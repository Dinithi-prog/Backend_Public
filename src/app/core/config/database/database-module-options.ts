import {ModuleMetadata} from '@nestjs/common';

import {Database} from './database.model';

export interface DatabaseModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<Database> | Database;
  inject: any[];
}
