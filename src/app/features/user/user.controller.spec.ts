import {Test, TestingModule} from '@nestjs/testing';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {CreateRoleDto} from './dto/create-role.dto';
import {UserLoginDto} from './dto/login-user.dto';
import {ObjectId} from 'mongodb';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      createUser: jest.fn(),
      loginUser: jest.fn(),
      createUserRole: jest.fn(),
      findAllUser: jest.fn(),
      findAllUserRole: jest.fn(),
      findOneUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService.createUser and return the result', async () => {
      const createUserDto: CreateUserDto = {
        userId: 'someUserId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securePassword',
        userRole: 'admin',
        mobileNumber: '1234567890',
        alternativeNumber: '0987654321',
        currentAddress: '123 Main St',
        permanentAddress: '456 Elm St',
        nic: '1234567890',
        dob: '1990-01-01',
        gender: 'Male',
        maritalStatus: 'Single',
        departmentName: 'IT',
        divisionName: 'Development',
        createAt: new Date(),
        updatedAt: new Date(),
        status: 'Active',
      };
      const expectedResult = {
        _id: new ObjectId(),
        ...createUserDto,
      };
      jest.spyOn(userService, 'createUser').mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call UserService.loginUser and return the result', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const expectedResult = {
        userId: 'someUserId',
        userName: 'John Doe',
        userRole: 'admin',
        token: 'someToken',
      };
      jest.spyOn(userService, 'loginUser').mockResolvedValue(expectedResult);

      const result = await controller.login(userLoginDto);

      expect(userService.loginUser).toHaveBeenCalledWith(userLoginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createUserRole', () => {
    it('should call UserService.createUserRole and return the result', async () => {
      const createRoleDto: CreateRoleDto = {
        roleId: 'someRoleId',
        roleName: 'admin',
        email: 'admin@example.com',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      const expectedResult = {
        _id: new ObjectId(),
        ...createRoleDto,
      };
      jest.spyOn(userService, 'createUserRole').mockResolvedValue(expectedResult);

      const result = await controller.createUserRole(createRoleDto);

      expect(userService.createUserRole).toHaveBeenCalledWith(createRoleDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllUser', () => {
    it('should call UserService.findAllUser and return the result', async () => {
      const expectedResult = [
        {
          _id: new ObjectId(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          userRole: 'admin',
          mobileNumber: '1234567890',
        },
      ];
      jest.spyOn(userService, 'findAllUser').mockResolvedValue(expectedResult);

      const result = await controller.findAllUsers();

      expect(userService.findAllUser).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllUserRole', () => {
    it('should call UserService.findAllUserRole and return the result', async () => {
      const expectedResult = [
        {
          _id: new ObjectId(),
          roleName: 'admin',
        },
      ];
      jest.spyOn(userService, 'findAllUserRole').mockResolvedValue(expectedResult);

      const result = await controller.findAllRoles();

      expect(userService.findAllUserRole).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOneUser', () => {
    it('should call UserService.findOneUser and return the result', async () => {
      const userId = 'someId';
      const expectedResult = {
        _id: new ObjectId(),
        id: userId,
        firstName: 'John',
      };
      jest.spyOn(userService, 'findOneUser').mockResolvedValue(expectedResult);

      const result = await controller.findOneUser(userId);

      expect(userService.findOneUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateUser', () => {
    it('should call UserService.updateUser and return the result', async () => {
      const userId = 'someId';
      const updateUserDto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const expectedResult = 'User updated successfully';
      jest.spyOn(userService, 'updateUser').mockResolvedValue(expectedResult);

      const result = await controller.updateUser(userId, updateUserDto);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteUser', () => {
    it('should call UserService.deleteUser and return the result', async () => {
      const userId = 'someId';
      const expectedResult = 'User deleted successfully';
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(expectedResult);

      const result = await controller.deleteUser(userId);

      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });
});
