import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String
});

const UserModel = new mongoose.model("user", UserSchema)
export default UserModel;