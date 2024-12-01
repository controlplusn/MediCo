import mongoose from "mongoose";

const Slist = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    subject: {
        type: String,
        required: true, 
    },
    type: {
        type: String,
        enum: ['Quiz', 'Exam', 'Activity', 'Others'], // Possible types of the document
        required: true,
    },
    FlashCard: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
        required: true,
    },
});

// Create a model from the schema
const studList = mongoose.model('studylist', Slist);

export default studList;