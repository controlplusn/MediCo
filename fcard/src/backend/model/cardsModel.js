import mongoose from "mongoose";

// Card Schema
const cardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  learnVal: { type: Boolean, default: false },
  CardId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

// Subset Schema
const subsetSchema = new mongoose.Schema({
  subsetName: { type: String, required: true },
  cards: [cardSchema] // Array of Card subdocuments
});

// Collection Schema
const collectionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  subsets: [subsetSchema], // Array of Subset subdocuments
  isArchived: { type: Boolean, default: false }
});

// Model
const Card = mongoose.model('cards', collectionSchema);


export default Card;
