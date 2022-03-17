const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const civicAPIURL = "https://civicinfo.googleapis.com/civicinfo/v2";
const key = process.env.CIVIC_API_KEY;

const fetchRepsData = async (address) => {
  const repsAPIURL = `${civicAPIURL}/representatives?address=${address}&key=${key}`;
  const repsData = await fetch(repsAPIURL);
  return repsData.json();
};

const fetchVoterInfoData = async (address) => {
  const voterInfoAPIURL = `${civicAPIURL}/voterinfo?address=${address}&key=${key}&electionId=2000`;
  const voterInfoData = await fetch(voterInfoAPIURL);
  return voterInfoData.json();
};

const parseAndFixRepsData = (repsData) => {
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
      let rep = officials[officialIndex];
      rep.index = officialIndex;
      rep.office = office.name;
      rep.division = divisions[office.divisionId].name;

      for (fix of fixPhotos) {
        if (rep.name === fix[0] && rep.office === fix[1]) {
          rep.photoUrl = fix[2];
        }
      }

      if (!rep.photoUrl) {
        rep.photoUrl =
          "https://cdn4.iconfinder.com/data/icons/music-ui-solid-24px/24/user_account_profile-2-512.png";
      }
    }
  }

  parsedRepsData.officials = officials;

  // console.log("PARSED REPS DATA:", parsedRepsData);

  return parsedRepsData;
};

const parseVoterInfoData = (voterInfoData) => {
  let parsedVoterInfoData = {};

  const { line1, city, state, zip } = voterInfoData.normalizedInput;

  let cleanAddress = "";
  if (line1) cleanAddress += line1 + ", ";
  if (city) cleanAddress += city + ", ";
  if (state) cleanAddress += state;
  if (zip) cleanAddress += " " + zip;

  parsedVoterInfoData.cleanAddress = cleanAddress;
  parsedVoterInfoData.state = voterInfoData.state;
  parsedVoterInfoData.contests = voterInfoData.contests;
  if (voterInfoData.pollingLocations) {
    parsedVoterInfoData.pollingLocations = voterInfoData.pollingLocations;
  }
  if (voterInfoData.earlyVoteSites) {
    parsedVoterInfoData.earlyVoteSites = voterInfoData.earlyVoteSites;
  }
  if (voterInfoData.dropOffLocations) {
    parsedVoterInfoData.dropOffLocations = voterInfoData.dropOffLocations;
  }

  // console.log("PARSED VOTER INFO DATA:", parsedVoterInfoData);

  return parsedVoterInfoData;
};

// ----
// ----
// Routes
router.get("/reps/:address", async (req, res) => {
  console.log("Reps API called for", req.params.address);
  try {
    const repsData = await fetchRepsData(req.params.address);
    const cleanRepsData = parseAndFixRepsData(repsData);
    // console.log(cleanRepsData);
    res.json(cleanRepsData);
  } catch (err) {
    console.log("GET REPS ERROR", err);
    res.status(400).json(err);
  }
});

router.get("/voterinfo/:address", async (req, res) => {
  console.log("Voter Info API called for", req.params.address);
  try {
    const voterInfoData = await fetchVoterInfoData(req.params.address);
    const cleanVoterInfoData = parseVoterInfoData(voterInfoData);
    // console.log(cleanVoterInfoData);
    res.json(cleanVoterInfoData);
  } catch (err) {
    console.log("GET VOTERINFO ERROR", err);
    res.status(400).json(err);
  }
});

// ----
// ----
// Fix reps photos
const fixPhotos = [
  [
    "Joseph R. Biden",
    "President of the United States",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/800px-Joe_Biden_presidential_portrait.jpg",
  ],
  [
    "Kamala D. Harris",
    "Vice President of the United States",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Kamala_Harris_Vice_Presidential_Portrait.jpg/800px-Kamala_Harris_Vice_Presidential_Portrait.jpg",
  ],
  [
    "Michael L. Parson",
    "Governor of Missouri",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mike_Parson_official_photo.jpg/800px-Mike_Parson_official_photo.jpg",
  ],
  [
    "Josh Hawley",
    "U.S. Senator",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Josh_Hawley%2C_official_portrait%2C_116th_congress.jpg/800px-Josh_Hawley%2C_official_portrait%2C_116th_congress.jpg",
  ],
  [
    "Charlie Baker",
    "Governor of Massachusetts",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Charlie_Baker_official_photo.jpg/800px-Charlie_Baker_official_photo.jpg",
  ],
  [
    "Karyn Polito",
    "Lieutenant Governor of Massachusetts",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Karyn_Polito_official_photo.jpg/800px-Karyn_Polito_official_photo.jpg",
  ],
  [
    "Kathleen C. Hochul",
    "Governor of New York",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Kathy_Hochul%2C_November_2017.jpeg/800px-Kathy_Hochul%2C_November_2017.jpeg",
  ],
  [
    "Gavin Newsom",
    "Governor of California",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Gavin_Newsom_by_Gage_Skidmore.jpg/800px-Gavin_Newsom_by_Gage_Skidmore.jpg",
  ],
  [
    "Ron DeSantis",
    "Governor of Florida",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ron_DeSantis_2020_%28cropped%29.jpg/800px-Ron_DeSantis_2020_%28cropped%29.jpg",
  ],
  [
    "Greg Abbott",
    "Governor of Texas",
    "https://gov.texas.gov/uploads/images/general/2015-GovernorAbbott-Portrait.jpg",
  ],
  [
    "Alex Padilla",
    "U.S. Senator",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Alex_Padilla_117th_Congress_portrait.jpg/800px-Alex_Padilla_117th_Congress_portrait.jpg",
  ],
  [
    "Eric Garcetti",
    "Mayor of Los Angeles",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Eric_Garcetti_in_Suit_and_Tie.jpg/800px-Eric_Garcetti_in_Suit_and_Tie.jpg",
  ],
  [
    "Karen Bass",
    "U.S. Representative",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Karen-Bass-2012.jpg/800px-Karen-Bass-2012.jpg",
  ],
];

module.exports = router;
