import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiConstants} from '@core/constants/api-constants';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {CreateRoleDto} from './dto/create-role.dto';
import {UniqueIdValidationPipe} from '@shared/pipes/unique-id-validation.pipe';
import {UserLoginDto} from './dto/login-user.dto';
import {Public} from '@core/decorators/public.decorator';
import {Roles} from '@core/decorators/roles.decorator';
import {AuthGuard} from '@core/guards/auth.guard';
import {UserRole} from './entity/user.entity';

@Controller(ApiConstants.USER)
@ApiTags(ApiConstants.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiOperation({summary: 'Create a new user'})
  @ApiResponse({status: 201, description: 'User successfully created.'})
  @ApiResponse({status: 400, description: 'Bad Request.'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({summary: 'Log in a user'})
  @ApiResponse({status: 200, description: 'User successfully logged in.'})
  @ApiResponse({status: 401, description: 'Invalid credentials.'})
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.loginUser(userLoginDto);
  }

  @Post('/roles')
  @ApiOperation({summary: 'Create a new user role'})
  @ApiResponse({status: 201, description: 'Role successfully created.'})
  @ApiResponse({status: 400, description: 'Bad Request.'})
  createUserRole(@Body() createRoleDto: CreateRoleDto) {
    return this.userService.createUserRole(createRoleDto);
  }

  @Get()
  @ApiOperation({summary: 'Retrieve all users'})
  @ApiResponse({status: 200, description: 'Users retrieved successfully.'})
  @Roles(UserRole.AdminUser)
  findAllUsers() {
    return this.userService.findAllUser();
  }

  @Get('/roles')
  @ApiOperation({summary: 'Retrieve all user roles'})
  @ApiResponse({status: 200, description: 'Roles retrieved successfully.'})
  findAllRoles() {
    return this.userService.findAllUserRole();
  }

  @Get(':id')
  @Public()
  @UsePipes(UniqueIdValidationPipe)
  @ApiOperation({summary: 'Retrieve a user by ID'})
  @ApiResponse({status: 200, description: 'User retrieved successfully.'})
  @ApiResponse({status: 404, description: 'User not found.'})
  findOneUser(@Param('id') id: string) {
    return this.userService.findOneUser(id);
  }

  @Patch(':id')
  @UsePipes(UniqueIdValidationPipe)
  @ApiOperation({summary: 'Update a user by ID'})
  @ApiResponse({status: 200, description: 'User updated successfully.'})
  @ApiResponse({status: 404, description: 'User not found.'})
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Public()
  @UsePipes(UniqueIdValidationPipe)
  @ApiOperation({summary: 'Delete a user by ID'})
  @ApiResponse({status: 200, description: 'User deleted successfully.'})
  @ApiResponse({status: 404, description: 'User not found.'})
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
