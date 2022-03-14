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

const parseAndFixRepsData = async (repsData) => {
  const addressData = repsData.normalizedInput;
  const { line1, city, state, zip } = addressData;

  let parsedRepsData = {};

  let parsedAddress = "";
  if (line1) parsedAddress += line1 + ", ";
  if (city) parsedAddress += city + ", ";
  if (state) parsedAddress += state;
  if (zip) parsedAddress += " " + zip;

  parsedRepsData.parsedAddress = parsedAddress;

  console.log("ADDRESS DATA", addressData);
  console.log(parsedAddress);
  console.log("PARSED DATA:", parsedRepsData);
};

router.get("/reps/:address", async (req, res) => {
  console.log("Reps API called for", req.params.address);
  try {
    const repsData = await fetchRepsData(req.params.address);
    parseAndFixRepsData(await repsData);
    res.json(repsData);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
