import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserRoleEntity } from '../entity/user-role.entity';


export class CreateRoleDto extends UserRoleEntity{
  email: any;
    
}