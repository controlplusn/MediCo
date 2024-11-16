import mongoose from "mongoose";

const heartSchema = new mongoose.Schema({
    heartId: {
        type: mongoose.Schema.Types.ObjectId, 
        auto: true,
        ref: 'posts'
      },
      username: {
        type: String,
        ref: 'users', 
        required: true
      }
});

const hearts =  mongoose.model('hearts',heartSchema);

export default hearts;
