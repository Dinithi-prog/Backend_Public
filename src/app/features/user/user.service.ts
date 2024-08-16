import {Injectable, BadRequestException, ConflictException, NotFoundException, Logger} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserRepository} from './repository/user.repository';
import {SchemaConstants} from '@core/constants/schema-constants';
import {UtilService} from '@shared/services/util.service';
import {UniqueIdConstants} from '@core/constants/unique-id-constants';
import {CreateRoleDto} from './dto/create-role.dto';
import {PasswordService} from '@shared/services/password.service';
import {JwtService} from '@shared/services/jwt-service.service';
import * as promClient from 'prom-client';
import {UserRole, UserStatus} from './entity/user.entity';

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  // Monitoring: Metrics example using prom-client
  private readonly requestCounter = new promClient.Counter({
    name: 'user_service_requests_total',
    help: 'Total number of requests to UserService',
    labelNames: ['method', 'status'],
  });

  constructor(
    private readonly userRepository: UserRepository,
    private readonly utilService: UtilService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('Creating a new user', {email: createUserDto.email});

    try {
      const userId = this.utilService.generateUniqueId(UniqueIdConstants.USER);
      createUserDto.userId = userId;

      const now = new Date();
      createUserDto.createAt = now;
      createUserDto.updatedAt = now;
      createUserDto.status = UserStatus.Active;
      createUserDto.userRole = UserRole.PublicUser;

      const dobYear = new Date(createUserDto.dob).getFullYear();
      const generatedPassword = `${createUserDto.firstName}${dobYear}`;
      createUserDto.password = await this.passwordService.hashPassword(generatedPassword);

      await this.checkDuplicates(SchemaConstants.USER, createUserDto);

      const user = await this.userRepository.createUser(SchemaConstants.USER, createUserDto);

      this.logger.log('User created successfully', {userId});
      this.requestCounter.inc({method: 'createUser', status: 'success'});
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', {email: createUserDto.email, error});
      this.requestCounter.inc({method: 'createUser', status: 'error'});
      throw error;
    }
  }

  async loginUser({email, password}: SignInParams) {
    this.logger.log(`Attempting to log in user: ${email}`);

    const registeredUser = await this.getUserOrThrow({email: email});

    await this.verifyPassword(password, registeredUser.password);

    const token = this.generateUserToken(registeredUser);

    this.logger.log(`User logged in successfully: ${email}`);

    this.incrementRequestCounter('success');

    return this.buildLoginResponse(registeredUser, token);
  }

  private async verifyPassword(inputPassword: string, storedPassword: string) {
    const isValidPassword = await this.passwordService.comparePasswords(inputPassword, storedPassword);
    if (!isValidPassword) {
      this.logger.warn('Invalid login attempt due to incorrect password');
      throw new BadRequestException('Invalid credentials');
    }
  }

  private generateUserToken(user: any) {
    const payload = {
      userId: user.userId,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.userRole,
    };
    return this.jwtService.generateJWT(payload);
  }

  private buildLoginResponse(user: any, token: string) {
    return {
      userId: user.userId,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.userRole,
      token,
    };
  }

  private incrementRequestCounter(status: string) {
    this.requestCounter.inc({method: 'loginUser', status});
  }

  async createUserRole(createRoleDto: CreateRoleDto) {
    this.logger.log('Creating a new user role', {roleName: createRoleDto.roleName});

    try {
      const roleId = this.utilService.generateUniqueId(UniqueIdConstants.ROLE);
      createRoleDto.roleId = roleId;

      const now = new Date();
      createRoleDto.createdAt = now;
      createRoleDto.updatedAt = now;

      await this.checkDuplicates(SchemaConstants.ROLE, {roleName: createRoleDto.roleName});

      const role = await this.userRepository.createRole(SchemaConstants.ROLE, createRoleDto);

      this.logger.log('User role created successfully', {roleId});
      this.requestCounter.inc({method: 'createUserRole', status: 'success'});
      return role;
    } catch (error) {
      this.logger.error('Failed to create user role', {roleName: createRoleDto.roleName, error});
      this.requestCounter.inc({method: 'createUserRole', status: 'error'});
      throw error;
    }
  }

  findAllUser() {
    this.logger.log('Retrieving all users');
    return this.userRepository.getUsers(SchemaConstants.USER, {});
  }

  findAllUserRole() {
    this.logger.log('Retrieving all user roles');
    return this.userRepository.getRoles(SchemaConstants.ROLE, {});
  }

  findOneUser(id: string) {
    this.logger.log('Retrieving user by ID', {userId: id});

    return this.getUserOrThrow({userId: id});
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log('Updating user', {userId: id});

    try {
      await this.getUserOrThrow({userId: id});

      updateUserDto.updatedAt = new Date();

      await this.userRepository.updateUser(SchemaConstants.USER, updateUserDto, {userId: id});

      this.logger.log('User updated successfully', {userId: id});
      this.requestCounter.inc({method: 'updateUser', status: 'success'});
      return 'User updated successfully';
    } catch (error) {
      this.logger.error('Failed to update user', {userId: id, error});
      this.requestCounter.inc({method: 'updateUser', status: 'error'});
      throw error;
    }
  }

  async deleteUser(id: string) {
    this.logger.log('Deleting user', {userId: id});

    try {
      await this.getUserOrThrow({userId: id});

      await this.userRepository.deleteUser(SchemaConstants.USER, {userId: id});

      this.logger.log('User deleted successfully', {userId: id});
      this.requestCounter.inc({method: 'deleteUser', status: 'success'});
      return 'User deleted successfully';
    } catch (error) {
      this.logger.error('Failed to delete user', {userId: id, error});
      this.requestCounter.inc({method: 'deleteUser', status: 'error'});
      throw error;
    }
  }

  private async getUserOrThrow(columnsAndValue: any) {
    this.logger.debug('Checking if user exists', {columnsAndValue});

    const user = await this.userRepository.getUser(SchemaConstants.USER, columnsAndValue);

    if (!user) {
      this.logger.warn('User not found', {columnsAndValue});
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async checkDuplicates(collectionName: string, columnsAndValue: any) {
    this.logger.debug('Checking for duplicate entry', {collectionName, columnsAndValue});

    const duplicate = await this.userRepository.getUser(collectionName, columnsAndValue);

    if (duplicate) {
      const duplicateValueString = Object.entries(columnsAndValue)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      this.logger.warn('Duplicate entry found', {collectionName, duplicateValueString});
      throw new ConflictException(`Duplicate ${collectionName} entry found for ${duplicateValueString}`);
    }
  }
}
