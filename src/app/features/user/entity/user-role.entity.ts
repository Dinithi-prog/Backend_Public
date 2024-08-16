import { IsNotEmpty, IsString } from "class-validator";

export class UserRoleEntity{
    
    
    @IsNotEmpty()
    @IsString()
    roleName: string;

    roleId: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}