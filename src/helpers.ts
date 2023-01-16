import { IncomingMessage } from 'http';

export async function getBody<T>(req: IncomingMessage): Promise<T> {
  return await new Promise((resolve, reject) => {
    try {
      const body: string[] = [];

      req.on('data', (chunk) => {
        body.push(chunk.toString());
      });

      req.on('end', () => {
        resolve(JSON.parse(body.join('')));
      });
    } catch (error) {
      reject(error);
    }
  });
}
