const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Event = require("./models/event");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/graphql",
  graphqlHttp({
    graphiql: true,
    schema: buildSchema(`
        type Event {
          _id: ID!,
          title: String!,
          description: String!,
          price: Float!,
          date: String!
        }

        type User {
          _id: ID!,
          email: String!,
          password: String
        }

        input EventInput {
          title: String!,
          description: String!,
          price: Float!,
          date: String!
        }

        input UserInput {
          email: String!,
          password: String!
        }

        type RootQuery {
            events: [Event!]!,
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
          return await Event.find();
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      createEvent: async ({
        eventInput: { title, description, price, date },
      }) => {
        try {
          const event = new Event({
            title,
            description,
            price,
            date: new Date(date),
          });
          event.creator = "5ec62298041d321859216b30";
          const createdEvent = await event.save();

          const user = await User.findById(createdEvent.creator);
          if (!user) throw new Error("User cannot found");
          user.createdEvents.push(createdEvent);
          await user.save();

          return createdEvent;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      createUser: async ({ userInput }) => {
        try {
          if (userInput.email == null || userInput.password == null) {
            throw Error("The email or password cannot be empty");
          }
          const isEmailExisted = await User.findOne({ email: userInput.email });
          if (isEmailExisted) throw new Error("User already existed");

          const user = new User({
            email: userInput.email,
            password: await bcrypt.hash(userInput.password, 15),
          });
          const result = await user.save();
          return { ...result._doc, password: null };
        } catch (err) {
          console.error(err);
          throw err; // This is needed so that the error message is displayed in GraphQL client
        }
      },
    },
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-booking-ykrrs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(3000, () => console.log("Listen to port 3000"));
  })
  .catch((err) => console.error(err));
