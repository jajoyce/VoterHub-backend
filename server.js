const express = require("express");
const app = express();
const controllers = require("./controllers");
require("dotenv").config();
const { PORT } = process.env;
const cors = require("cors");
const morgan = require("morgan");

const db = require("./models");
db.pgConnect();
// For Heroku:
// db.sequelize.sync();
// db.sequelize.sync({ force: true });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/civicAPI", controllers.civicInfo);
app.use("/user-auth", controllers.userAuth);
app.use("/notes-rep", controllers.noteRep);

app.get("/", (req, res) => {
  res.send("Hello, world. This is working.");
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
