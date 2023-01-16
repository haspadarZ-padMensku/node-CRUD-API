# node-CRUD-API

RSSchool-nodejs-2022-q4

## How to run

To run the app in development mode you should run following commands in your terminal:

- `npm run start:dev`

To run the app in production mode you should run following commands in your terminal:

- `npm run start:prod`

To run the app in multiple threads mode you should run following commands in your terminal:

- `npm run start:multi`

## How to use

To use the app you should use Postman for making http requests.

### Available endpoints

- GET api/users is used to get all persons
- GET api/users/{userId}
- POST api/users is used to create record about new user and store it in database
- PUT api/users/{userId} is used to update existing user
- DELETE api/users/{userId} is used to delete existing user from database

## Testing

To run test you should

- open terminal
- run development mode
- `npm run test`
- close the app (ctrl+C)
