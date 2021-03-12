const mongoose = require("mongoose");

const CoreTheoryContent = mongoose.Schema({
  courseArea: { type: String, required: true },
  courseSubArea: { type: String, required: true },
  materialCategory: { type: String, required: true },
  authorUsername: { type: String, required: true },
  title: { type: String, required: true },
  tags: { type: Array, required: false },
  datePublished: { type: Date, required: true },
  view: { type: Number, required: false },
  like: { type: Number, required: false },
  minRead: { type: Number, required: true },
  contentData: { type: Object, required: true },
});

module.exports = Core_Theory_Content = mongoose.model(
  "Core_Theory_Content",
  CoreTheoryContent
);
