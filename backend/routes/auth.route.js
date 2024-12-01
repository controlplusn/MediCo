import express from 'express';
import UserModel from '../model/User.js';
import { generateToken } from '../utils/generateToken.js'; 
import { verifyToken } from '../middleware/verifyToken.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const {email, username, password} = req.body;

    try {
        if (!email || !username || !password) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await UserModel.findOne({email});
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            email,
            username,
            password: hashedPassword
        });

        await user.save();

        // jwt token
        generateToken(res, user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
}); 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid username or password" })
        }

        generateToken(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
 
    } catch (error) {
        console.log("Error in login: " + error);
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
});


// JWT auth
router.get('/check-auth', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password") // does not display the password

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (err) {
        console.log("Error in checkAuth", err);
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/get-username/:id', async (req, res) => {
    const userId = req.params.id; // Get the _id from the request params

    try {
        // Find user by ID and select only the username field
        const user = await UserModel.findById(userId).select("username");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, username: user.username });
    } catch (err) {
        console.error("Error fetching username:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

export default router;