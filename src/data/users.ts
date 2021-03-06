import { getConnection } from 'typeorm';

import { User } from '../models';

export const getUsers = async (): Promise<User[]> => {
  const usersRepository = getConnection().getRepository(User);
  return await usersRepository.find();
};

export const getUserById = async (guid: string): Promise<User> => {
  const usersRepository = getConnection().getRepository(User);
  return await usersRepository.findOneOrFail(guid);
};

export const createUser = async (user: User): Promise<void> => {
  const usersRepository = getConnection().getRepository(User);
  await usersRepository.insert(new User(user));
};

export const deleteUser = async (guid: string): Promise<void> => {
  const usersRepository = getConnection().getRepository(User);
  await usersRepository.delete(guid);
};

export const updateUser = async (guid: string, userProps: Partial<User>): Promise<void> => {
  const usersRepository = getConnection().getRepository(User);
  await usersRepository.update(guid, userProps);
};
