import express from 'express';
import Post from '../model/postModel.js';
import hearts from '../model/heartModel.js';
import { verifyToken } from '../middleware/verifyToken.js';
import UserModel from '../model/User.js';
import Comment from '../model/commentModel.js';

const router = express.Router();

/* --POST-- */

router.get("/communities", async (req,res) => {
    try{
        const data = await Post.find({});
        res.json({ data: data });
    }catch(e){
        console.error('Error displaying data:', e);
        res.status(404).send({ success: false, message: "Error displaying data" });
    }
});

router.post("/add", verifyToken, async (req, res) => {
    try {
      const { Content, Subject, label } = req.body;

      const userId = req.userId;

      // fetch username associated with the userId
      const user = await UserModel.findById(userId);
      console.log(user);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const username = user.username;   
  
      // Validate the required fields
      if (!Content || !Subject || !username || !label) {
        return res.status(400).json({ error: 'Content, Subject, and Username are required.' });
      }
  
      // Create a new Post document
      const newPost = new Post({
        Content,
        label,
        Subject,
        username,
        userId
      });
      
    
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (e) {
      console.error('Error adding data:', e);
      res.status(500).send({ success: false, message: "Error adding data" });
    }
});

/* --HEART-- */
router.get("/load-heart/:heartId", async (req,res) =>{//adding likes
    try{
      const { heartId } = req.params; 
      const data = await hearts.find({ heartId : heartId});
      res.json({ success: true, data: data });
    }catch(e){
      console.error('Error loading data:', e);
      res.status(404).send({ success: false, message: "Error loading data data" });
    }
});

router.get("/isHeart/:heartId/:username", async (req,res) =>{//checking if liked
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

router.post("/addHeart", async (req, res) => { 
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

router.delete("/deleteHeart/:heartId/:username", async (req,res) => {
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

/* --COMMENT-- */
router.post("/addComment", verifyToken, async (req, res) => { 
  const { body, commentId } = req.body; // Extract data from request body
  const userId = req.userId;
  
  try {
    if (!userId || !commentId || !body) {
      return res.status(400).json({ error: 'Lack of data' });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Creating comment struct
    const newComment = new Comment({
      body,
      userId,
      username: user.username,
      commentId
    });


    const savedComment = await newComment.save();
    res.status(201).json(savedComment);

  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send({ success: false, message: "Error adding data" });
  }
});

router.get("/comment/:commentId", async (req,res) =>{
  const { commentId } = req.params;
  console.log("Comment id:", commentId) ;

  try{
    const data = await Comment.find({ commentId : commentId});

    res.json({ success: true, data: data });

  }catch(e){
    console.error('Error displaying data:', e);
    res.status(404).send({ success: false, message: "Data not found" });
  }
});



export default router;