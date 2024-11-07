import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    isVerifies: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const UserModel = new mongoose.model("user", UserSchema)
export default UserModel;