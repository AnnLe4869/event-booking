const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("hello world");
  next();
});
app.listen(3000, () => console.log("Listen to port 3000"));
