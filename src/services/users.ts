import User from '../types/User';
import database from '../database';

export const getUsers = async (): Promise<User[]> => {
  return await new Promise((resolve, reject) => {
    resolve(database.users);
  });
};

export const getUser = async (id: string): Promise<User | undefined> => {
  return await new Promise((resolve, reject) => {
    const existed = database.users.find((user) => user.id === id);

    resolve(existed);
  });
};

export const createUser = async (data: User): Promise<User | undefined> => {
  return await new Promise((resolve, reject) => {
    const existed = database.users.some((user) => user.id === data.id);

    if (existed) {
      resolve(undefined);
    } else {
      database.users.push(data);
      resolve(data);
    }
  });
};

export const deleteUser = async (id: string): Promise<string | undefined> => {
  return await new Promise((resolve, reject) => {
    const existed = database.users.find((user) => user.id === id);

    if (!existed) {
      resolve(undefined);
    } else {
      const existedIndex = database.users.indexOf(existed);
      database.users.splice(existedIndex, 1);
      resolve(id);
    }
  });
};

export const updateUser = async (data: User): Promise<User | undefined> => {
  return await new Promise((resolve, reject) => {
    const existed = database.users.find((user) => user.id === data.id);

    if (!existed) {
      resolve(undefined);
    } else {
      const existedIndex = database.users.indexOf(existed);
      database.users[existedIndex] = data;
      resolve(data);
    }
  });
};
