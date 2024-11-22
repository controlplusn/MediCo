import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Comment Schema
const CommentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    time: { type: Date, default: Date.now },
    _id: { type: mongoose.Types.ObjectId, default:new mongoose.Types.ObjectId ,unique:true} // Automatically generated ObjectId
  });
  
  // Discussion Schema
  const DiscussionSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    likes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
    _id: { type: mongoose.Types.ObjectId, default:new mongoose.Types.ObjectId, unique:true } // Automatically generated ObjectId
  });
  

// Main Schema
const ClassSchema = new Schema({
  title: { type: String, required: true },
  host: { type: String, required: true },
  people: { type: [String], default: [] }, 
  discussion: { type: [DiscussionSchema], default: [] } //connected to discussion schema
});

// Compile the model
const Class = model('class', ClassSchema);//magiging classes to lol

export default Class;
