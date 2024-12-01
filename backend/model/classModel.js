import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Comment Schema
const CommentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    
  },{timestamps:true});
  
  // Discussion Schema
  const DiscussionSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    likes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] }
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