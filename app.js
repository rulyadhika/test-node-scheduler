const express = require("express");
const scheduler = require("node-schedule");
const axios = require("axios");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/test-cron");

const weatherModel = require("./models/WeatherModel");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send({ message: "hello" });
});

app.get("/test-api", async (req, res) => {
  try {
    const response = await axios.get(
      "https://cuaca-gempa-rest-api.vercel.app/weather/jawa-barat/bandung"
    );

    if (response.status === 200) {
      await weatherModel.create({
        fetchedAt: new Date(),
        results: response.data.data,
      });
      res.status(200).send({ success: true, data: response.data.data });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, error });
  }
});

const job = scheduler.scheduleJob("*/10 * * * * *", async () => {
  console.log("Running job fetching data " + new Date());
  try {
    const response = await axios.get(
      "https://cuaca-gempa-rest-api.vercel.app/weather/jawa-barat/bandung"
    );

    if (response.status === 200) {
      await weatherModel.create({
        fetchedAt: new Date(),
        results: response.data.data,
      });

      console.log("data saved to db");
    }
  } catch (error) {
    console.log(error);
  }

  console.log("finish running job " + new Date());
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
