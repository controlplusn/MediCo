import express from 'express';
import mongoose from 'mongoose';
import studList from '../model/studylist.js'; 
import { verifyToken } from '../middleware/verifyToken.js';
import ToDoModel from '../model/todoModel.js';


const router = express.Router();


router.get("/todo", verifyToken, async (req, res) => {
    try {
        const todos = await ToDoModel.findOne({ userId: req.userId })
        
        if (!todos) return res.status(404).json({ error: "Not tasks found from the user" });

        res.status(200).json(todos);
    } catch (e) {
        console.error('Error displaying data:', e);
        res.status(404).send({ success: false, message: "Error displaying data" });
    }
});
    

router.post("/add", verifyToken, async (req, res) => {
    const { task, done } = req.body;

    try {
        const result = await ToDoModel.findOneAndUpdate(
            { userId: req.userId },
            { $push: { ToDo: { task, done } } },
            { new: true, useFindAndModify: false }
        );

        if (!result) return res.status(400).json({ message: "User not found" });

        res.status(201).send({ task, done });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).send({ success: false, message: "Error adding data" });
    }
});

router.put("/update", async (req, res) => {
    try {
        const { id, progress } = req.body;
        
        if (!id || progress == null) {
            return res.status(400).send({ success: false, message: "Invalid input data" });
        }

        const result = await studList.updateOne({ _id: id }, { $set: { progress } });

        if (result.nModified === 0) {
            return res.status(404).send({ success: false, message: "No record found to update" });
        }

        res.send({ success: true, message: "Progress updated successfully" });
    } catch (e) {
        console.error('Error updating data:', e);
        res.status(500).send({ success: false, message: "Error updating data" });
    }
});


router.delete("/delete/:id", async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await studList.deleteOne({ _id: id });

        // Check if any document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).send({ success: false, message: "No record found to delete" });
        }

        res.send({ success: true, message: "Data deleted successfully" });
    }catch (e) {
        console.error('Error deleting data:', e);
        res.status(101).send({ success: false, message: "Error deleting data" });
    }

})

export default router;