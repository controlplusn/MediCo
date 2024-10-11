import { User } from '../models/User.js'
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const {email, username, password} = req.body;

    try {
        if (!email || !username || !password) {
            throw new Error("All fields are required")
        }

        // email
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        // password
        const hashedPassword = await bcrypt.hash(password, 10);
        const veriicationToken = Math.floor(10000 + Math.random() * 900000).toString();
        
        const user = new User({
            email,
            username,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save();

    } catch (error) {
        res.status(400).json({succes: false, message: error.message});
    }
}

export const login = async (req, res) => {
    res.send("login route")
}