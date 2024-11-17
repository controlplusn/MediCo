import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    ref: 'users', 
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required:true
  },
  time: {
    type: Date,
    default: Date.now
  },
}, {

});

const Comment = mongoose.model('comments', commentSchema);

export default Comment;