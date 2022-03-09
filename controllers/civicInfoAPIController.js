const express = require("express");
const router = express.Router();
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const repsAPI = "https://civicinfo.googleapis.com/civicinfo/v2/representatives";
const key = process.env.CIVIC_API_KEY;
const address = "24 Beacon St, Boston, MA 02133";

const fetchRepsData = async () => {
    const repsData = await fetch(repsAPI + `?address=${address}&key=${key}`);
    return repsData.json();
};

router.get("/", async (req, res) => {
    console.log("reps");
    console.log("KEY: " + key);
    try {
        console.log("testing");
        const repsData = await fetchRepsData();
        console.log(await repsData);
        res.json(repsData);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
