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

app.post("/Cards/:userId/:flashcardId/addSubset", async (req, res) => {
    try {
      const { userId, flashcardId } = req.params;
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
