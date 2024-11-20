import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Card from '../model/cardsModel.js';

const router = express.Router();

// loading cards
router.get("/cards/:userId", verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // get user token from JWT when user is verified

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        // Fetch data from the database
        const data = await Card.find({ userId });

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

router.post('/cards/add', verifyToken, async (req, res) => {
    const userId = req.userId;
    console.log('Retrieved userId for adding cards:', userId);

    const { collectionName } = req.body;

    try {
        if (!collectionName) {
            return res.status(400).json({
                success: false,
                message: "Collection name is required"
            });
        }

        // find the collection belonging to the user
        let collection = await Card.findOne({ userId, name: collectionName });

        // if collection doesn't exists
        if (!collection) {
            collection = new Card({
                userId,
                name: collectionName,
                subsets: [{
                    subsetName: "All subset",
                    cards: []
                }]
            });

            await collection.save();
            return res.status(201).json({
                success: true,
                message: "New collection created successfully",
                collection
            });
        }

        if (collection) {
            return res.status(400).json({
                success: false,
                message: "Collection already exists"
            });
        }

        const newCollection = new Card({
            userId,
            name: collectionName,
            subsets: []
        });

        await newCollection.save();
        return res.status(201).json({
            success: true,
            message: "Collection created successfully"
        });

    } catch (error) {
        console.error("Error adding flashcard or collection:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Unable to process the request."
        });
    }
});

router.delete('/cards/delete/:collectionId', verifyToken, async (req, res) => {
    console.log("Received DELETE request for collection ID:", req.params.collectionId);
    const userId = req.userId;
    console.log("Verify userId:", userId);

    const { collectionId } = req.params;
    console.log("Collection id:", collectionId);

    try {
        // check if collection exists and belong to the user
        const collection = await Card.findOne({ _id: collectionId, userId });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found" 
            });
        }

        await Card.deleteOne({ _id: collectionId });

        res.status(200).json({
            success: true,
            message: "Collection deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Unable to delete the collection."
        });
    }
});



export default router;