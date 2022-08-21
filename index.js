const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const config = require("./utils/config");
const routes = require("./utils/routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connectMongoose = async () => {
  await mongoose
    .connect(config.dbUrl)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("err");
    });
};
app.get("/", (req, res) => res.send("Hello World! Successfull"));

app.listen(process.env.PORT || config.port, async () => {
  console.log(
    `Todo app listening on http://localhost:5000 ---------> ${config.port}`
  );
  await connectMongoose();
  await routes(app);
});

//10-08-2022

module.exports = app;
