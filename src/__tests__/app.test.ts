import http from 'http';
import database from '../database';

const PORT = process.env.PORT ?? 4000;

const postData = JSON.stringify({
  username: 'Test name 1',
  age: 20,
  hobbies: ['music', 'films', 'basketball'],
});

beforeAll(() => (database.users = []));

afterAll(() => (database.users = []));

describe('App', () => {
  it('should return the empty list of users', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/users`, (res) => {
        try {
          const body: string[] = [];

          res.on('data', (chunk) => {
            body.push(chunk.toString());
          });

          res.on('end', () => {
            resolve(JSON.parse(body.join('')));
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    expect(res).toStrictEqual([]);
  });

  it('should create new user', async () => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const res = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        try {
          const body: string[] = [];

          res.on('data', (chunk) => {
            body.push(chunk.toString());
          });

          res.on('end', () => {
            resolve(JSON.parse(body.join('')));
          });
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      req.write(postData);
      req.end();
    });

    const { id, ...rest } = res as any;

    expect(rest).toStrictEqual({
      username: 'Test name 1',
      age: 20,
      hobbies: ['music', 'films', 'basketball'],
    });
  });

  it('should return list of users with created one record and should get user by id', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/users`, (res) => {
        try {
          const body: string[] = [];

          res.on('data', (chunk) => {
            body.push(chunk.toString());
          });

          res.on('end', () => {
            resolve(JSON.parse(body.join('')));
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    const [{ id }] = res as any;

    const resAfter = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/users/${id}`, (res) => {
        try {
          const body: string[] = [];

          res.on('data', (chunk) => {
            body.push(chunk.toString());
          });

          res.on('end', () => {
            resolve(JSON.parse(body.join('')));
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    expect(resAfter).toStrictEqual({ ...JSON.parse(postData), id });
  });
});
