import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from './../user/common/test/TestUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when search all users', () => {
    it('should be list all users', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.findAllUsers();

      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('when search a user by id', () => {
    it('should find a existing user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findUserById('1');

      expect(userFound).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findUserById('2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('when create user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);
      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should return a exception when doesnt create a user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);

      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema para criar um usuário',
        });
      });

      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('when update user', () => {
    it('Should update a user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      const updatedUser = { name: 'Nome Atualizado' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'Nome Atualizado',
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('when delete user', () => {
    it('should delete a existing user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.delete.mockReturnValue(user);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('should not delete a inexisting user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('10');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
