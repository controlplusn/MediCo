import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mongoose from 'mongoose';
import { Icon } from '@iconify/react';

export const FlearnContent = ({ }) => {
  const [subsetData, setSubsetData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // State for index
  const [learnedPercentage, setLearnedPercentage] = useState(0); // Track learned percentage
  const userId = '672ca9b1572b8a9dad197f4c';
  const subsetId = '5f8d0c2b9d1e8e1a4e5f1023';
  const [FlashcardData,setFlascardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1234/Cards/${userId}`);
        
        // Find the cardSet that contains the given subsetId
        const cardSet = response.data.data.find(item =>
          item.subsets.some(subset => subset.subsetId === subsetId)
        );
  
        if (cardSet) {
          // Find the subset that matches the given subsetId
          const subset = cardSet.subsets.find(subset => subset.subsetId === subsetId);
          setSubsetData(subset);
          console.log('Subset Data:', subset);
  
          // Find the Flashcard Data for the matching subsetId
          const flashcard = response.data.data.find(item =>
            item.subsets.some(subset => subset.subsetId === subsetId)
          );
  
          if (flashcard) {
            setFlascardData(flashcard); // Set the FlashcardData state
            console.log('Flashcard Data:', flashcard);
          } else {
            console.error('Flashcard not found for the given subsetId');
          }
        } else {
          console.error('Card set not found for the given subsetId');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  }, [userId, subsetId]); // Re-run when userId or subsetId changes  

  useEffect(() => {
    if (subsetData) {
      // Calculate the learned percentage based on cards that are marked as learned
      const learnedCount = subsetData.cards.filter(card => card.isLearned).length;
      const totalCount = subsetData.cards.length;
      const percentage = totalCount > 0 ? (learnedCount / totalCount) * 100 : 0;
      setLearnedPercentage(percentage);
    }
  }, [subsetData]);

  if (!subsetData) {
    return <div>Loading...</div>;
  }

  const handleNext = () => {
    if (currentIndex < subsetData.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the beginning
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(subsetData.cards.length - 1); // Loop back to the end
    }
  };

  const updateCardLearnVal = async (learnVal) => {
    const cardId = subsetData.cards[currentIndex].cardId; // Get the current card's CardId
    const FlashcardId = FlashcardData._id; // Use the _id of the subset as the FlashcardId
    console.log("FlashcardId:", FlashcardId);
    console.log("cardId:", cardId);

    try {
      // Ensure FlashcardId and cardId are valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(FlashcardId) || !mongoose.Types.ObjectId.isValid(cardId)) {
        console.error("Invalid FlashcardId or cardId");
        return;
      }
  
      // Send the update request to the backend
      const response = await axios.put(`http://localhost:1234/Cards/update/${FlashcardId}/${cardId}`, { learnVal });
  
      if (response.data.success) {
        console.log('Card learnVal updated successfully');
        
        // After updating the card, recalculate the learned percentage
        const updatedSubset = { ...subsetData };
        updatedSubset.cards[currentIndex].isLearned = learnVal;
        setSubsetData(updatedSubset); // Trigger re-render

      } else {
        console.error('Error updating learnVal:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating learnVal:', error.message);
    }
  };

  const handleGood = () => {
    updateCardLearnVal(true);
    handleNext(); // Go to the next card after the update
  };

  const handleBad = () => {
    updateCardLearnVal(false);
    handleNext(); // Go to the next card after the update
  };

  return (
    <div className="flearn--content--container">
      <h5>{subsetData.subsetName}</h5>
      <label>
        <div className="tagname">
          {subsetData.cards[currentIndex].isLearned ? <h6>Learned</h6> : <h6>On Progress</h6>}
        </div>
      </label>

      <progress value={learnedPercentage} max={100} />
      <div className="qna--container">
        <h6>{subsetData.cards[currentIndex].question}</h6>
      </div>
      <hr className="borderline" />
      <div className="prevnnext">
        <Icon icon="ep:arrow-left" onClick={handlePrevious} />
        <h5>{subsetData.cards[currentIndex].answer}</h5>
        <Icon icon="ep:arrow-right" onClick={handleNext} />
      </div>
      <div>
        <button onClick={handleGood}>Good</button>
        <button onClick={handleBad}>Bad</button>
      </div>
    </div>
  );
};

export default FlearnContent;
