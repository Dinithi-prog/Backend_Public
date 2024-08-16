import {Injectable, Logger} from '@nestjs/common';
import {Database} from '@core/config/database/database.model';

@Injectable()
export class DatabaseRepository {
  private readonly logger = new Logger(DatabaseRepository.name);

  constructor(private readonly database: Database) {}

  async selectWithAnd(collectionName: string, columnsAndValues: any): Promise<any[]> {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.find(columnsAndValues).toArray();
    } catch (err) {
      this.logger.error('Query error in selectWithAnd', err);
      throw err;
    }
  }

  async selectWithAndOne(collectionName: string, columnsAndValues: any): Promise<any | null> {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.findOne(columnsAndValues);
    } catch (err) {
      this.logger.error('Query error in selectWithAndOne', err);
      throw err;
    }
  }

  async insertSingle(collectionName: string, columnsAndValues: any): Promise<any | null> {
    const dbCollection = this.database.collection(collectionName);
    try {
      const result = await dbCollection.insertOne(columnsAndValues);
      if (result.acknowledged) {
        const insertedId = result.insertedId;
        return await dbCollection.findOne({_id: insertedId});
      } else {
        this.logger.error('Insertion failed', result);
        return null;
      }
    } catch (err) {
      this.logger.error('Query error in insertSingle', err);
      throw err;
    }
  }

  async updateSingle(collectionName: string, columnsToUpdate: any, targetColumnsAndValues: any): Promise<any> {
    const dbCollection = this.database.collection(collectionName);
    try {
      const result = await dbCollection.updateOne(targetColumnsAndValues, {$set: columnsToUpdate});
      if (result.modifiedCount === 1) {
        return result;
      } else {
        this.logger.error('Document not found or update failed', result);
        return null;
      }
    } catch (err) {
      this.logger.error('Query error in updateSingle', err);
      throw err;
    }
  }

  async updateAndReturn(
    collectionName: string,
    columnsToUpdate: any,
    targetColumnsAndValues: any,
  ): Promise<any | null> {
    const dbCollection = this.database.collection(collectionName);
    try {
      const result = await dbCollection.findOneAndUpdate(
        targetColumnsAndValues,
        {$set: columnsToUpdate},
        {
          upsert: true,
          returnDocument: 'after',
        },
      );

      if (result && result.value) {
        return result.value;
      } else {
        this.logger.error('Update operation failed, result is null', result);
        return null;
      }
    } catch (err) {
      this.logger.error('Query error in updateAndReturn', err);
      throw err;
    }
  }

  async updateArrayAndReturn(
    collectionName: string,
    updateOperator: any,
    targetColumnsAndValues: any,
  ): Promise<any | null> {
    const dbCollection = this.database.collection(collectionName);
    try {
      const result = await dbCollection.findOneAndUpdate(targetColumnsAndValues, updateOperator, {
        upsert: true,
        returnDocument: 'after',
      });

      if (result && result.value) {
        return result.value;
      } else {
        this.logger.error('Update operation failed, result is null', result);
        return null;
      }
    } catch (err) {
      this.logger.error('Query error in updateArrayAndReturn', err);
      throw err;
    }
  }

  async joinWithAnd(collectionName: string, pipeline: any[]): Promise<any[]> {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.aggregate(pipeline).toArray();
    } catch (err) {
      this.logger.error('Query error in joinWithAnd', err);
      throw err;
    }
  }

  async deleteOne(collectionName: string, targetColumnsAndValues: any): Promise<any> {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.deleteOne(targetColumnsAndValues);
    } catch (err) {
      this.logger.error('Query error in deleteOne', err);
      throw err;
    }
  }
}
