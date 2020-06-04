This project was created with NodeJS, MongoDB, GraphQL and React

## How to run the program

1. Create a nodemon.json that have all credentials needed to connect to MongoDB database
2. Run `npm install` to install all necessary packages for server-side
3. Run `npm run dev`. This should run on port 8000
4. Navigate to client folder and run `npm install` to install all necessary packages for client-side
5. Run `npm start`. This should run on port 3000

## Features

-User can create new user or log into existing user
-User can create new event
-User can view event create by other people
-User can book an event created by other people
-User can cancel a booking

## Todos

- Add more authentications (e.g email, text message) when user first time sign up
- User can edit or delete an event he/she created
- Some warning or info tag to tell user that he/she already booked this event
- Maintain the token so that if user reload the page he/she won't need to log in again
