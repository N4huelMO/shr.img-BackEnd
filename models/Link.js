const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const linkSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  original_name: {
    type: String,
    required: true,
  },
  downloads: {
    type: Number,
    default: 1,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Link", linkSchema);
