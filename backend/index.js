import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './model/User.js';

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3001;

mongoose.connect("mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({username: username})
    .then(user => {
        if (user) {
            if (user.password === password) {
                res.json("Success");
            } else {
                res.json("incorrect password");
            }
        } else {
            res.json("cannot find user");
        }
    })
});

app.post('/signup', (req, res) => {
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

app.listen(
    PORT,
    () => {console.log("Server running")} 
)