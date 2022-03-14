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
  const { normalizedInput, divisions, offices, officials } = repsData;

  let parsedRepsData = {};

  const { line1, city, state, zip } = normalizedInput;

  let cleanAddress = "";
  if (line1) cleanAddress += line1 + ", ";
  if (city) cleanAddress += city + ", ";
  if (state) cleanAddress += state;
  if (zip) cleanAddress += " " + zip;

  parsedRepsData.cleanAddress = cleanAddress;

  for (office of offices) {
    for (officialIndex of office.officialIndices) {
      officials[officialIndex].office = office.name;
      officials[officialIndex].division = divisions[office.divisionId].name;
      // console.log("------");
      // console.log(officials[officialIndex].name);
      // console.log(officials[officialIndex].office);
      // console.log(officials[officialIndex].division);
    }
  }

  parsedRepsData.officials = officials;

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
