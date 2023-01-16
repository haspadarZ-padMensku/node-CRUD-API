import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate } from 'uuid';
import User from '../types/User';
import * as UserService from '../services/users';
import { getBody } from '../helpers';

export const getUsers = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const users = await UserService.getUsers();
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } catch (error: any) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: error?.message || 'Something went wrong...' })
    );
  }
};

export const getUser = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const id = req.url?.split('/')[2];

    if (id && !validate(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'User Id is not valid.' }));
      return;
    }

    const user = id ? await UserService.getUser(id) : undefined;

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User does not exist.' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(user));
  } catch (error: any) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: error?.message || 'Something went wrong...' })
    );
  }
};

export const createUser = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const body = await getBody<Omit<User, 'id'>>(req);

    const ALLOWED_FIELDS = ['username', 'age', 'hobbies'];
    const errors: any = {};

    const notAllowedFields = Object.keys(body).filter(
      (field) => !ALLOWED_FIELDS.includes(field)
    );

    if (notAllowedFields.length) {
      errors.fields = `'${notAllowedFields.join(
        ', '
      )}' are not allowed. Allowed are '${ALLOWED_FIELDS.join(', ')}'`;
    }

    if (!body.username) {
      errors.username = 'username is required.';
    } else if (typeof body.username !== 'string') {
      errors.username = 'username should be a string.';
    }

    if (!body.age) {
      errors.age = 'age is required.';
    } else if (typeof body.age !== 'number') {
      errors.age = 'age should be a number.';
    }

    if (!body.hobbies) {
      errors.hobbies = 'hobbies is required.';
    } else if (
      body.hobbies.length &&
      !body.hobbies.every((hobby) => typeof hobby === 'string')
    ) {
      errors.hobbies = 'hobbies should be an array of strings.';
    }

    if (Object.keys(errors).length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ errors }));
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username: body.username,
      age: body.age,
      hobbies: body.hobbies,
    };

    const createdUser = await UserService.createUser(newUser);

    if (!createdUser) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'User id already exist.' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createdUser));
  } catch (error: any) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: error?.message || 'Something went wrong...' })
    );
  }
};

export const deleteUser = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const id = req.url?.split('/')[2];

    if (id && !validate(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'User Id is not valid.' }));
      return;
    }

    const deletedId = id ? await UserService.deleteUser(id) : undefined;

    if (!deletedId) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User does not exist.' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ id: deletedId }));
  } catch (error: any) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: error?.message || 'Something went wrong...' })
    );
  }
};

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const body = await getBody<Omit<User, 'id'>>(req);
    const id = req.url?.split('/')[2];

    if (id && !validate(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'User Id is not valid.' }));
      return;
    }

    const errors: any = {};

    const ALLOWED_FIELDS = ['username', 'age', 'hobbies'];
    const notAllowedFields = Object.keys(body).filter(
      (field) => !ALLOWED_FIELDS.includes(field)
    );

    if (notAllowedFields.length) {
      errors.fields = `'${notAllowedFields.join(
        ', '
      )}' are not allowed. Allowed are '${ALLOWED_FIELDS.join(', ')}'`;
    }

    if (!body.username) {
      errors.username = 'username is required.';
    } else if (typeof body.username !== 'string') {
      errors.username = 'username should be a string.';
    }

    if (!body.age) {
      errors.age = 'age is required.';
    } else if (typeof body.age !== 'number') {
      errors.age = 'age should be a number.';
    }

    if (!body.hobbies) {
      errors.hobbies = 'hobbies is required.';
    } else if (
      body.hobbies.length &&
      !body.hobbies.every((hobby) => typeof hobby === 'string')
    ) {
      errors.hobbies = 'hobbies should be an array of strings.';
    }

    if (Object.keys(errors).length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ errors }));
      return;
    }

    const userToUpdate: User = {
      id: id ?? '',
      username: body.username,
      age: body.age,
      hobbies: body.hobbies,
    };

    const updatedUser = await UserService.updateUser(userToUpdate);

    if (!updatedUser) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User does not exist.' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(updatedUser));
  } catch (error: any) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: error?.message || 'Something went wrong...' })
    );
  }
};
