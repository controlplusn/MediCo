import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username:{
    type:String,
    required:true
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