const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let events = [];

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
      events: () => events,
      createEvent: ({ eventInput: { title, description, price, date } }) => {
        const event = {
          _id: Math.random(),
          title: title,
          description: description,
          price: price,
          date: date ? date : new Date().toISOString(),
        };
        events.push(event);
        return event;
      },
    },
  })
);
app.listen(3000, () => console.log("Listen to port 3000"));
