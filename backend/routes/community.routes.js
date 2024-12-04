import express from 'express';
import Post from '../model/postModel.js';
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
router.post('/addLike/:postId/:username', verifyToken, async (req, res) => {
  const { postId, username } = req.params;
  try {
    const postData = await Post.findById(postId);

    if (!postData) return res.status(404).json({ message: 'Post not found' });

    if (postData.likes.includes(username)) {
      return res.status(400).json({ message: 'You have already liked this discussion' });
    } else {
      postData.likes.push(username);
      postData.likesCount = postData.likes.length;  // Increment likes count
      await postData.save();
      res.status(200).json({
        message: 'Post liked successfully',
        likes: postData.likes,
        likesCount: postData.likesCount,
      });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deleteLike/:postId/:username', verifyToken, async (req, res) => {
  const { postId, username } = req.params;
  try {
    const postData = await Post.findById(postId);

    if (!postData) return res.status(404).json({ message: 'Post not found' });

    if (!postData.likes.includes(username)) {
      return res.status(400).json({ message: 'You have not liked this discussion' });
    } else {
      postData.likes = postData.likes.filter(user => user !== username);
      postData.likesCount = postData.likes.length;  // Decrement likes count
      await postData.save();
      res.status(200).json({
        message: 'Post unliked successfully',
        likes: postData.likes,
        likesCount: postData.likesCount,
      });
    }
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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