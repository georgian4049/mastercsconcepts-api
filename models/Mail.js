const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  latestUpdateDate: {
    type: Date,
    required: true,
  },
  requestStatus: {
    type: String,
    required: true,
  },
  messages: [
    {
      text: { type: String, required: true },
      date: { type: Date, required: true },
      visited: { type: Boolean, required: true },
      sender: { type: String, required: true },
    },
  ],
  seen: {
    type: Boolean,
    required: true,
  },
});

module.exports = Mail = mongoose.model("Mail", MailSchema);
