import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserRepository} from './repository/user.repository';
import {UtilService} from '@shared/services/util.service';
import {PasswordService} from '@shared/services/password.service';
import {JwtService} from '@shared/services/jwt-service.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UtilService, PasswordService, JwtService],
})
export class UserModule {}
