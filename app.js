const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/graphql",
  graphqlHttp({
    graphiql: true,
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => ["hello", "all night coding"],
      createEvent: (args) => args.name,
    },
  })
);
app.listen(3000, () => console.log("Listen kto port 3000"));
