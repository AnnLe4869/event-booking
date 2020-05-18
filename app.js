const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
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

        input EventInput {
          title: String!,
          description: String!,
          price: Float!,
          date: String
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
          await event.save();
          return event;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    },
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-booking-ykrrs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000, () => console.log("Listen to port 3000"));
  })
  .catch((err) => console.error(err));
