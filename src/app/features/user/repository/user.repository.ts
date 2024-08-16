import {Database} from '@core/config/database/database.model';
import {Injectable} from '@nestjs/common';
import {DatabaseRepository} from '@shared/repositories/database.repository';

@Injectable()
export class UserRepository extends DatabaseRepository {
  constructor(database: Database) {
    super(database);
  }

  async createUser(collectionName: string, userParam: any) {
    return this.insertSingle(collectionName, userParam);
  }

  async createRole(collectionName: string, userParam: any) {
    return this.insertSingle(collectionName, userParam);
  }

  async getUsers(collectionName: string, columnsAndValues: any) {
    return this.selectWithAnd(collectionName, columnsAndValues);
  }

  async getRoles(collectionName: string, columnsAndValues: any) {
    return this.selectWithAnd(collectionName, columnsAndValues);
  }

  async getUser(collectionName: string, columnsAndValues: any) {
    return this.selectWithAndOne(collectionName, columnsAndValues);
  }

  async updateUser(collectionName: string, columnsAndValues: any, targetColumnsAndValues: any) {
    return this.updateSingle(collectionName, columnsAndValues, targetColumnsAndValues);
  }

  async deleteUser(collectionName: string, targetColumnsAndValues: any) {
    return this.deleteOne(collectionName, targetColumnsAndValues);
  }
}
