# Pair Coding

#### Check the pair-coding-frontend repo for description.

## Details
This is a NodeJS App which uses ExpressJS.
  1. It uses Socket.io for handling the connections with the client.
  2. MongoDB (dev environment) or Mlab (prod environment) is used as Database.
  3. Mongoose is used as ODM middleware.
  4. It uses CircleCI and Heroku for CI/CD (Only master branch gets deployed).

### Getting Started
  1. Download/clone the repository.
  2. Run `npm install` to install all the dependencies.
  3. Run `npm run start-dev` to start local server for development.

### Environment Variables
  1. When the app is deployed the node server requires `process.env.PORT` variable. Default PORT is 3000.
  2. To connect to the database specify the `process.env.DB_URL` variable. Default is `mongodb://localhost:27017/pair-coding`.
  3. Specify the JWT Token secret key as `process.env.JWT_SECRET_KEY` variable. Default is `Secret@123#`.
  4. The app uses send grid to send verification emails. Specify `process.env.EMAIL_API_KEY` variable.
  5. Send grid emails need to specify the backend url to be called for verification. Specify `process.env.BACKEND_URL` variable that points to the website URL (Just the domain name). Default is `http://localhost:3000`
  6. After email verification user is redirected to frontend website. Specify `process.env.FRONTEND_URL` variable. Default is `http://localhost:8000`

### CI and CD Environment Variables

  #### CircleCI Configurations
  Both the below configurations are used to push to the heroku server. CircleCI force pushes the code to heroku to avoid any conflicts.
   1. Specify the environment variable `HEROKU_API_KEY` which is the heroku api key for deployment.
   2. Specify the environment variable `HEROKU_APP_NAME` which is the app name in heroku.

  #### Heroku Configurations
   1. Set the environment variable `DB_URL` in heroku to connect the database. 
   2. Set the environment variable `JWT_SECRET_KEY` in heroku.
   3. Set `process.env.EMAIL_API_KEY` variable for send grid API.
   4. Set `process.env.BACKEND_URL` variable that points to the website URL (Just the domain name).
   5. Set `process.env.FRONTEND_URL` variable for redirection.
