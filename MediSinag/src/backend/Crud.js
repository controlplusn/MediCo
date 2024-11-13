import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import studList from './models/studylist.js'; 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

const uri = 'mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority';

mongoose.connect(uri)
.then(() => {
    console.log("Connected to DB")
    app.listen(PORT,() => console.log("Server is Running"))})
.catch((err) => console.log(err));

    // const insertSampleData = async () => {
        // const sampleData = new studList({
        //     date: new Date(),
        //     progress: 50,
        //     status: 'Not Done',
        //     subject: 'Mathematics',
        //     type: 'Quiz',
        //     userId: '672ca9b1572b8a9dad197f4c', // Replace with an actual user ID
        //     FlashCard: 'Sample FlashCard Text',
        // });

    //     try {
    //         await sampleData.save();
    //         console.log('Sample data inserted');
    //     } catch (error) {
    //         console.error('Error inserting sample data:', error);
    //     }
    // };

    // // Call the function to insert sample data
    // //insertSampleData();

app.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params; // Destructure `userId` from `req.params`
        const data = await studList.find({ userId: userId });
        res.json({ success: true, data: data });
    } catch (e) {
        console.error('Error displaying data:', e);
        res.status(404).send({ success: false, message: "Error displaying data" });
    }
});
    

app.post("/add", async (req, res) => {
    try {
        const data = new studList({
            ...req.body,
            date: new Date(req.body.date),  // Convert date string to Date object
            userId: new mongoose.Types.ObjectId(req.body.userId),  // Convert to ObjectId
        });
        await data.save();
        res.send({ success: true, message: "Data added successfully" });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).send({ success: false, message: "Error adding data" });
    }
});

app.put("/update", async (req,res) => {
    try{
        const {id, progress} = req.body;
        
        const result = await studList.updateOne({ _id: id }, { $set: { progress: progress } });
        
        // Check if any document was modified
        if (result.nModified === 0) {
            return res.status(404).send({ success: false, message: "No record found to update" });
        }

        res.send({ success: true, message: "Progress updated successfully" });
        //req.send({success:true, message : "update success"});
    }catch(e){
        console.error('Error updating data:', e);
        res.status(101).send({ success: false, message: "Error updating data" });
    }

});

app.delete("/delete/:id", async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await studList.deleteOne({ _id: id });

        // Check if any document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).send({ success: false, message: "No record found to delete" });
        }

        res.send({ success: true, message: "Data deleted successfully" });
    }catch{
        console.error('Error deleting data:', e);
        res.status(101).send({ success: false, message: "Error deleting data" });
    }

})