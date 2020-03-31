const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const favouriteSchema = new Schema({
  userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  diet: {
    type: String,
    enum: ['VEG', 'VEGAN', 'NONVEG', 'GF', 'NP']
  },
  recipeId: Array
}, {
  timestamps: true
});

const Favourite = mongoose.model("Favourite", favouriteSchema);
module.exports = Favourite;
