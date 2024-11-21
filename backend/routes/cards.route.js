import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Card from '../model/cardsModel.js';

const router = express.Router();

// loading cards
router.get("/cards", verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // get user token from JWT when user is verified

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        console.log("Fetching cards for user:", userId);
        // Fetch data from the database
        const data = await Card.find({ userId });

        // Process data and calculate statistics for each card set
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
    const userId = req.userId;

    const { collectionId } = req.params;

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

router.put("/renameCard", async (req, res) => {
    try{
        const {id, name} = req.body;
        
        const result = await Card.updateOne({ _id: id }, { $set: {  name : name } });
        
        // Check if any document was modified
        if (result.nModified === 0) {
            return res.status(404).send({ success: false, message: "No record found to update" });
        }

        res.send({ success: true, message: "Progress updated successfully" });

    }catch(e){
        console.error("Error updating data:", e);
        res.status(270).json({ success: false, message: "Server error" });
    }
});

/// category-based flashcard
router.get('/cards/:categoryId', verifyToken, async (req, res) => {
    const { categoryId } = req.params // from req parameter

    const userId = req.userId; // from verified token

    try {
        // find specific card collection by id, ensure it belongs to the authenticated user
        const category = await Card.findOne({ _id: categoryId, userId });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found or does not belong to the user"
            });
        }

        // Format response
        const formattedCategory = {
            name: category.name,
            subsets: category.subsets.map(subset => ({
                subsetName: subset.subsetName,
                cards: subset.cards.map(card => ({
                    question: card.question,
                    answer: card.answer,
                    isLearned: card.learnVal
                })),
            })),
        };

        res.status(200).json({
            success: true,
            data: category
        });


    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to fetch the category.',
        });
    }
});

router.post("/Cards/:flashcardId/addSubset", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        console.log("Retrieved user id from subset:", userId);
        const { flashcardId } = req.params;
        const { subsetName } = req.body; // Only subsetName is required
        
        if (!userId || !flashcardId || !subsetName) {
          return res.status(400).json({ success: false, message: "User ID, Flashcard ID, and subsetName are required" });
        }
      
        // Find the flashcard by userId and flashcardId
        const flashcard = await Card.findOne({ userId: userId, _id: flashcardId });
      
        if (!flashcard) {
          return res.status(404).json({ success: false, message: "Flashcard not found" });
        }
      
        // Create a new subset object
        const newSubset = {
          subsetName: subsetName,
          cards: [] // Initialize with an empty array
        };
      
        // Push the new subset into the subsets array
        flashcard.subsets.push(newSubset);
      
        // Save the updated flashcard
        await flashcard.save();
      
        res.status(200).json({
          success: true,
          message: "Subset added successfully",
          updatedFlashcard: flashcard,
        });
  
    } catch (e) {
        console.error("Error adding subset:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
  });


export default router;
