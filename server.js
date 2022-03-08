const express = require("express");
const app = express();
require("dotenv").config()
const { PORT } = process.env;

app.get("/", (req, res) => {
    res.send("Hello, world. This is working.")
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));