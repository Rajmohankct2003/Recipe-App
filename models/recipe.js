const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const recipeSchema = new Schema({
   recipeId: String,
   userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   username: String,
   rating: Number,
   comments: String
}, {
  timestamps: true
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
