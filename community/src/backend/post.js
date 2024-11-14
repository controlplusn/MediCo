import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Post from './model/postModel.js'; 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 6969;

const uri = 'mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority';

mongoose.connect(uri)
.then(() => {
    console.log("Connected to DB")
    app.listen(PORT,() => console.log("Server is Running"))})
.catch((err) => console.log(err));


app.get("/", async (req,res) => {
    try{
        const data = await Post.find({});
        res.json({ data: data });
    }catch(e){
        console.error('Error displaying data:', e);
        res.status(404).send({ success: false, message: "Error displaying data" });
    }
});

app.post("/add", async (req, res) => {
    try {
      const { Content, Subject, username } = req.body;
  
      // Validate the required fields
      if (!Content || !Subject || !username) {
        return res.status(400).json({ error: 'Content, Subject, and Username are required.' });
      }
  
      // Create a new Post document
      const newPost = new Post({
        Content,
        Subject,
        username
      });
  
      // Save the new post to the database
      const savedPost = await newPost.save();
  
      // Send the saved post as a response
      res.status(201).json(savedPost);
    } catch (e) { // Correctly referencing the error variable
      console.error('Error adding data:', e);
      res.status(500).send({ success: false, message: "Error adding data" });
    }
  });
