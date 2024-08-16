import {Injectable} from '@nestjs/common';
import {Db} from 'mongodb';

@Injectable()
export class Database extends Db {}
