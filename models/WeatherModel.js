const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  fetchedAt: {
    type: Date,
  },
  results: {
    type: Array,
  },
});

const weatherModel = mongoose.model("Weather", weatherSchema);

module.exports = weatherModel;
