const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  googleID: String,
  facebookID: String,
  firstname: String,
  lastname: String,
  picture: String,
  age: Number
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
