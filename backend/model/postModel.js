import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  Content: {
    type: String,
    required: true
  },
  PostedAt: {
    type: Date,
    default: Date.now // Will automatically set the current date and time if not provided
  },
  Subject: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true,
    default: "General"
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId, 
    auto: true
  },
  heartId: {
    type: mongoose.Schema.Types.ObjectId, 
    auto: true 
  },
  username: {
    type: String,
    ref: 'users', 
    required: true
  }
});

const Post = mongoose.model('posts', postSchema);

export default Post;