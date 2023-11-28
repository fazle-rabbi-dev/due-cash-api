const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    reuired: true,
  },
  username: {
    type: String,
    reuired: true,
  },
  email: {
    type: String,
    reuired: true,
  },
  password:{
    type: String,
    reuired: true,
  },
  tokens: {
    type: [String],
    default: [],
    reuired: false,
  },
  authtoken: {
    type: String,
    required: true,
  },
  isconfirmed: {
    type: Boolean,
    default: false
  },
  createdOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = userSchema;