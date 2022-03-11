const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const civicAPIURL = "https://civicinfo.googleapis.com/civicinfo/v2";
const key = process.env.CIVIC_API_KEY;
// const address = "24 Beacon St, Boston, MA 02133";

const fetchRepsData = async (address) => {
  const repsAPIURL = `${civicAPIURL}/representatives?address=${address}&key=${key}`;
  const repsData = await fetch(repsAPIURL);
  return repsData.json();
};

router.get("/reps/:address", async (req, res) => {
  console.log("reps");
  console.log("KEY: " + key);
  try {
    console.log("testing");
    const repsData = await fetchRepsData(req.params.address);
    console.log(await repsData);
    res.json(repsData);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
