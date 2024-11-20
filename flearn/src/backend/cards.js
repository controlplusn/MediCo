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
        const data = await Card.find({ userId : userId });

        // Process data and calculate statistics for each card set
        const processedData = data.map((data_item) => {
            let totalCards = 0;
            let learnedCards = 0;

            // Aggregate cards across all subsets in a card set
            const subsets = data_item.subsets.map((subset) => {
                const cards = subset.cards.map((card) => {
                    // Count total cards and learned cards for the entire card set
                    console.log(card,"\n\n")
                    totalCards++;
                    if (card.learnVal) learnedCards++;

                    return {
                        question: card.question,
                        answer: card.answer,
                        isLearned: card.learnVal,
                        cardId: card.CardId
                    };
                });

                return {
                    subsetName: subset.subsetName,
                    cards,subsetId: subset._id
                };
            });

            // Calculate the percentage for the entire card set
            const learnedPercentage = totalCards > 0 ? (learnedCards / totalCards) * 100 : 0;

            return {
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

        // Respond with processed data and statistics
        res.json({
            success: true,
            data: processedData,
        });

    } catch (e) {
        console.error("Error loading data:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});