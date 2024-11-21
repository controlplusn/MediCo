import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Card from './model/cardsModel.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 1234;

const uri = 'mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority';

mongoose.connect(uri)
.then(() => {
    console.log("Connected to DB")
    app.listen(PORT,() => console.log("Server is Running"))})
.catch((err) => console.log(err));

/* Loading Cards */
app.get("/Cards/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        // Fetch data from the database
        const data = await Card.find({ userId: userId });

        // Process data and calculate statistics for each card set and subset
        const processedData = data.map((data_item) => {
            let totalCards = 0;
            let learnedCards = 0;

            // Aggregate cards across all subsets in a card set
            const subsets = data_item.subsets.map((subset) => {
                let subsetTotalCards = 0;
                let subsetLearnedCards = 0;

                const cards = subset.cards.map((card) => {
                    // Count total cards and learned cards for the entire card set and individual subset
                    totalCards++;
                    subsetTotalCards++;
                    if (card.learnVal) {
                        learnedCards++;
                        subsetLearnedCards++;
                    }

                    return {
                        question: card.question,
                        answer: card.answer,
                        isLearned: card.learnVal,
                        cardId: card.CardId
                    };
                });

                // Calculate the percentage for each subset
                const subsetLearnedPercentage = subsetTotalCards > 0 ? (subsetLearnedCards / subsetTotalCards) * 100 : 0;

                return {
                    subsetName: subset.subsetName,
                    cards,
                    subsetId: subset._id,
                    statistics: {
                        totalCards: subsetTotalCards,
                        learnedCards: subsetLearnedCards,
                        learnedPercentage: subsetLearnedPercentage.toFixed(2), // Format percentage to 2 decimal places
                    },
                };
            });

            // Calculate the percentage for the entire card set
            const learnedPercentage = totalCards > 0 ? (learnedCards / totalCards) * 100 : 0;

            return {
                _id: data_item._id,
                name: data_item.name,
                subsets,
                statistics: {
                    totalCards,
                    learnedCards,
                    learnedPercentage: learnedPercentage.toFixed(2), // Format percentage to 2 decimal places
                },
                isArchived: data_item.isArchived,
            };
        });


        res.json({
            success: true,
            data: processedData,
        });

    } catch (e) {
        console.error("Error loading data:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/* Add Flashcard to Specific Subset */
app.post('/Cards/:userId/:cardSetId/:subsetId', async (req, res) => {
    try {
        const { userId, cardSetId, subsetId } = req.params;
        const { question, answer} = req.body;

        if (!userId || !cardSetId || !subsetId) {
            return res.status(400).json({ success: false, message: "Missing required parameters." });
        }

        if (!question || !answer) {
            return res.status(400).json({ success: false, message: "Question and answer are required." });
        }

        // Find the card set by cardSetId and subsetId
        const cardSet = await Card.findOne({ _id: cardSetId, userId: userId });

        if (!cardSet) {
            return res.status(404).json({ success: false, message: "Card set not found." });
        }

        // Find the subset
        const subset = cardSet.subsets.id(subsetId);
        if (!subset) {
            return res.status(404).json({ success: false, message: "Subset not found." });
        }

        // Add new flashcard to the subset
        const newCard = {
            question,
            answer
        };
        subset.cards.push(newCard);

        // Save the changes to the database
        await cardSet.save();

        res.status(201).json({
            success: true,
            message: "Flashcard added successfully.",
            cardSet,
        });
    } catch (error) {
        console.error("Error adding flashcard:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

/* Update Flashcard in a Specific Subset */
app.put('/UpdateCards/:userId/:cardSetId/:subsetId/:cardId', async (req, res) => {
    try {
        const { userId, cardSetId, subsetId, cardId } = req.params;
        const { question, answer } = req.body;

        if (!userId || !cardSetId || !subsetId || !cardId) {
            return res.status(400).json({ success: false, message: "Missing required parameters." });
        }

        if (!question || !answer) {
            return res.status(400).json({ success: false, message: "Question and answer are required." });
        }

        // Find the card set by cardSetId and userId
        const cardSet = await Card.findOne({ _id: cardSetId, userId: userId });
        if (!cardSet) {
            return res.status(404).json({ success: false, message: "Card set not found." });
        }

        // Find the subset by subsetId
        const subset = cardSet.subsets.id(subsetId);
        if (!subset) {
            return res.status(404).json({ success: false, message: "Subset not found." });
        }

        // Find the specific card by CardId (not _id)
        const card = subset.cards.find((card) => String(card.CardId) === cardId);
        if (!card) {
            return res.status(404).json({ success: false, message: "Flashcard not found." });
        }

        // Update the question and answer
        card.question = question;
        card.answer = answer;

        // Save the changes to the database
        await cardSet.save();

        res.status(200).json({
            success: true,
            message: "Flashcard updated successfully.",
            updatedCard: card,
        });
    } catch (error) {
        console.error("Error updating flashcard:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});