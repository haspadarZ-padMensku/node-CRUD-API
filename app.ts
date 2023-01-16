import http from 'http';
import * as dotenv from 'dotenv';
import * as UserController from './src/controllers/user';

dotenv.config();

const PORT = process.env.PORT ?? 4000;

const server = http.createServer();

server.listen(PORT);
server.on('request', (req, res) => {
  res.setHeader('Context-type', 'application/json');

  process.on('uncaughtException', () => {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Something went wrong...' }));
  });

  const params = req.url?.split('/')?.slice(1);
  const route = params?.[0];

  if (route === 'users' && params?.length === 1 && req.method === 'GET') {
    console.log('get users');
    UserController.getUsers(req, res);
  } else if (
    route === 'users' &&
    params?.length === 2 &&
    req.method === 'GET'
  ) {
    console.log('get user');
    UserController.getUser(req, res);
  } else if (route === 'users' && req.method === 'POST') {
    console.log('create user');
    UserController.createUser(req, res);
  } else if (
    route === 'users' &&
    params?.length === 2 &&
    req.method === 'DELETE'
  ) {
    console.log('delete user');
    UserController.deleteUser(req, res);
  } else if (
    route === 'users' &&
    params?.length === 2 &&
    req.method === 'PUT'
  ) {
    console.log('update user');
    UserController.updateUser(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'The route does not exist' }));
  }
});

server.on('listening', () => {
  console.log(`Server is running on port: ${PORT}`);
});
