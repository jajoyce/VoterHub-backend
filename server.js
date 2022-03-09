const express = require("express");
const app = express();
const controllers = require("./controllers");
require("dotenv").config();
const { PORT } = process.env;
const cors = require("cors");
const morgan = require("morgan");

const { Sequelize } = require("sequelize");

// Option 1: Passing a connection URI
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("voter_hub", "jaj", "password", {
  host: "localhost",
  dialect: "postgres",
});

async function pgConnect() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

pgConnect();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/reps", controllers.civicInfo);

app.get("/", (req, res) => {
  res.send("Hello, world. This is working.");
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
