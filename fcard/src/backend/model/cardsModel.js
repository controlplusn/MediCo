import mongoose from "mongoose";

const subsetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: {
    type: [String, String, Number], // e.g., ["question", "answer", 1]
    required: true
  }
});

const cards = new mongoose.Schema({
  username: { type: [String], required: true },
  name: { type: String, required: true },
  subsets: { type: [subsetSchema], required: true }
});


const Card= mongoose.model('cards', cards);

export default Card;
