import express from 'express';
import Post from '../model/postModel.js';
import hearts from '../model/heartModel.js';

const router = express.Router();

router.get("/communities", async (req,res) => {
    try{
        const data = await Post.find({});
        res.json({ data: data });
    }catch(e){
        console.error('Error displaying data:', e);
        res.status(404).send({ success: false, message: "Error displaying data" });
    }
});

router.post("/add", async (req, res) => {
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


export default router;