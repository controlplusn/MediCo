import mongoose from "mongoose";

// Card Schema
const cardSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  answer: { 
    type: String, 
    required: true 
  },
  learnVal: { // tracker if the card is learned
    type: Boolean, 
    default: false 
  },
  CardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    auto: true
  }
});

// Subset Schema
const subsetSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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

},{timestamps: true});

// Model
const Card = mongoose.model('cards', collectionSchema);


export default Card;