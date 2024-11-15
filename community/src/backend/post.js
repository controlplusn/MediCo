import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Post from './model/postModel.js'; 
import hearts from './model/heartModel.js';

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
      const { Content, Subject, username, label } = req.body;
  
      // Validate the required fields
      if (!Content || !Subject || !username || !label) {
        return res.status(400).json({ error: 'Content, Subject, and Username are required.' });
      }
  
      // Create a new Post document
      const newPost = new Post({
        Content,
        label,
        Subject,
        username
      });
  
    
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (e) {
      console.error('Error adding data:', e);
      res.status(500).send({ success: false, message: "Error adding data" });
    }
  });

  app.get("/load-heart/:heartId", async (req,res) =>{//adding likes
    try{
      const { heartId } = req.params; 
      const data = await hearts.find({ heartId : heartId});
      res.json({ success: true, data: data });
    }catch(e){
      console.error('Error loading data:', e);
      res.status(404).send({ success: false, message: "Error loading data data" });
    }
  });

  app.get("/isHeart/:heartId/:username", async (req,res) =>{//checking if liked
    try{
      const { heartId } = req.params; 
      const { username } = req.params;
      const data = await hearts.find({ heartId : heartId, username : username});
      res.json({ success: true, data: data });
    }catch(e){
      console.error('Error loading data:', e);
      res.status(404).send({ success: false, message: "Error loading data data" });
    }
  });

app.post("/addHeart", async (req, res) => { 
  const { username, heartId } = req.body; // Extract data from request body
  
  try {
    if (!username || !heartId) {
      return res.status(400).json({ error: 'Lack of data' });
    }

    // Create a new heart entry
    const newHeart = new hearts({
      username,
      heartId,
    });

    const savedHeart = await newHeart.save();
    res.status(201).json(savedHeart);

  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send({ success: false, message: "Error adding data" });
  }
});
  
app.delete("/deleteHeart/:heartId/:username", async (req,res) => {
  const { heartId } = req.params; 
  const { username } = req.params;
  try{
      const result = await hearts.deleteOne({ heartId : heartId, username : username});


      if (result.deletedCount === 0) {
          return res.status(404).send({ success: false, message: "No record found to delete" });
      }

      res.send({ success: true, message: "Data deleted successfully" });
  }catch(e){
    console.error('Error deleting hearts:', error);
    res.status(500).send({ success: false, message: "Error deleting data" });
  }
});