import {IsEnum, IsNotEmpty, IsOptional, IsPort, IsString} from 'class-validator';
import {NodeEnvironment} from '../env';

export class EnvironmentConfig {
  @IsOptional()
  @IsPort()
  PORT = `3000`;

  @IsOptional()
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.DEV;

  @IsString()
  @IsNotEmpty()
  DATABASE_CONNECTION_STRING: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;
}
