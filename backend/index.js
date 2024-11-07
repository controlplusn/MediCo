import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './model/User.js';
import connectDB from './db/connectDB.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3001; 

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

app.listen(PORT, () => {
    connectDB();
    console.log("Server running");
});