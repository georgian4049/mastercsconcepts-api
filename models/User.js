const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: false,
  },
  interest: {
    type: Array,
    required: false,
  },
  likedContentsId: {
    type: Array,
    required: false,
  },
  commentedContentsId: {
    type: Array,
    required: false,
  },
  bookmarked: {
    type: Array,
    required: true,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
