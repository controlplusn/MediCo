import express from 'express';
import studList from '../model/studylist.js'; 
import { verifyToken } from '../middleware/verifyToken.js';
import ToDoModel from '../model/todoModel.js';


const router = express.Router();


router.get("/todo", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        // find tassk for logged in user
        const result = await ToDoModel.findOne({ userId });
        
        // If user or tasks are not found
        if (!result || !result.ToDo) {
            return res.status(404).json({ success: false, message: "No tasks found for this user" });
        }

        res.status(200).json({ success: true, ToDo: result.ToDo });
    } catch (e) {
        console.error('Error displaying data:', e);
        res.status(404).send({ success: false, message: "Error displaying data" });
    }
});
    

router.post("/add", verifyToken, async (req, res) => {
    const { task, done } = req.body;
    const userId = req.userId; // Extracted from verified token

    if (!userId || !task) {
        console.log("Missing userId or task");
        return res.status(400).json({ message: "Invalid request. Missing userId or task." });
    }

    try {
        let result = await ToDoModel.findOneAndUpdate(
            { userId }, // userId from token
            { $push: { ToDo: { task, done } } },
            { new: true, useFindAndModify: false }
        );

        // If no document is found, create a new one
        if (!result) {
            const newToDo = new ToDoModel({
                userId,
                ToDo: [{ task, done }]
            });
            result = await newToDo.save();
            console.log("New task document saved:", result);
        }

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