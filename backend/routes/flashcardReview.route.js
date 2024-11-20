import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Card from '../model/cardsModel.js';

const router = express.Router();

// update cards
router.post('/answer/:cardId', verifyToken, async (req, res) => {
    const { cardId } = req.params;
    console.log("Card id:", cardId);

    try {

        const { correctAnswer } = req.body // true or false
        
        // update card based on answer
        const card = await Card.findById(cardId);

        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Card not found"
            });
        }

        // Update spaced repetition interval logic
        if (correctAnswer) {
            card.reviewInterval *= 2;
        } else {
            card.reviewInterval = 1;
        }

        // Update next review date based on the new interval
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + card.reviewInterval);

        // set last reviewed date and next review date
        card.nextReview = nextReviewDate;
        card.lastReviewed = new Date();

        await card.save;

        res.status(200).json({
            success: true,
            message: "Card updated successfully",
            updatedCard: card
        });

    } catch (error) {
        console.error("Error updating card:", error);
        res.status(500).json({ success: false, message: "Error updating the card" });
    }
});



export default router;