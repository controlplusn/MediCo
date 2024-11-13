import mongoose from "mongoose";

const Slist = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    progress: {
        type: Number,
        min: 0, // Minimum progress value
        max: 100, // Maximum progress value
        required: true,
    },
    status: {
        type: String,
        enum: ['Done', 'Not Done','Pending'], // Possible values for status
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Quiz', 'Assignment', 'Exam'], // Possible types of the document
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
        required: true,
        ref: 'users',
    },
    FlashCard: {
        type: String,
        required: true,
    },
});

// Create a model from the schema
const studList = mongoose.model('studylist', Slist);

export default studList;