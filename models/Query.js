const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = Query = mongoose.model("Query", QuerySchema);
