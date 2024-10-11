const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users')

const app = express();
app.use(cors());
app.use(express.json());


// connect to mongodb
mongoose.connect(
    "mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority&appName=Cluster0"
);

// api to access the users 
app.get("/getUsers", (req, res) => {
    UserModel.find({}).then(function(users) {
        res.json(users);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(user);
})


// run the server
app.listen(3000, () => {
    console.log("Server is running");
});