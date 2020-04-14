const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const recipeSchema = new Schema({
   recipeId: String,
   title:String,
   image: String,
   rating: Number,
   review: String
}, {
  timestamps: true
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
