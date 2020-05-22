const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/graphql",
  graphqlHttp({
    graphiql: true,
    schema: graphqlSchema,
    rootValue: graphqlResolver,
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
