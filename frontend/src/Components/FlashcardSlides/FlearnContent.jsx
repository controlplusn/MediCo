import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Icon } from '@iconify/react';

const FlearnContent = ({ subsetId }) => {
    const [subsetData, setSubsetData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // State for index
    const [learnedPercentage, setLearnedPercentage] = useState(0); // Track learned percentage
    const [flashcard, setFlashcard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // fetch the user Id from JWT
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
            withCredentials: true,
          });
          if (response.data.user) {
            setUserId(response.data.user._id);
          }
        } catch (err) {
          console.error('Error checking authentication:', err);
        }
      };

      fetchUser();
    }, []);

    // fetch flashcards that are on the subset
    useEffect(() => {
        const fetchFlashcards = async () => {
          if (!subsetId) {
            setError(new Error('No subset ID provided'));
            setLoading(false);
            return;
          }
          
          if (userId) {
            try {
              const response = await axios.get(`http://localhost:3001/api/flashcard/cards`, {
                withCredentials: true,
              });
      
              console.log('API Response:', response.data);

              if (response.data.success) {
                setFlashcard(response.data.data);
                
                // Find the category and subset
                const category = response.data.data.find(cat => 
                  cat.subsets.some(subset => subset.subsetId === subsetId)
                );

                console.log("Category:", category);

                if (category) {
                  const subset = category.subsets.find(subset => subset.subsetId === subsetId);
                  
                  if (subset) {
                    setSubsetData(subset);
                    setLearnedPercentage(parseFloat(subset.statistics.learnedPercentage));
                    console.log('Subset Cards:', subset.cards);
                  } else {
                    setError(new Error('Subset not found'));
                  }
                } else {
                  setError(new Error('Category not found'));
                }
              } else {
                setError(new Error(response.data.message || 'Failed to fetch flashcard data'));
              }
            } catch (error) {
              console.error('Error fetching flashcards:', error);
              setError(error);
            } finally {
              setLoading(false);
            }
          }
        };
      
        fetchFlashcards();
        
    }, [userId, subsetId]);

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
        if (!flashcard || !subsetData) {
          console.error("Flashcard or subset data is not available");
          return;
        }
      
        const cardId = subsetData.cards[currentIndex]._id; // Assuming each card has its own _id
        const category = flashcard.find(cat => cat.subsets.some(subset => subset._id === subsetId));
        
        if (!category) {
          console.error("Category not found");
          return;
        }
      
        const FlashcardId = category._id; // Use the _id of the category as the FlashcardId
        console.log("FlashcardId:", FlashcardId);
        console.log("cardId:", cardId);
      
        try {
        //   if (!mongoose.Types.ObjectId.isValid(FlashcardId) || !mongoose.Types.ObjectId.isValid(cardId)) {
        //     console.error("Invalid FlashcardId or cardId");
        //     return;
        //   }
      
          const response = await axios.put(`http://localhost:3001/api/flashcard/update/${FlashcardId}/${cardId}`, { learnVal }, {
            withCredentials: true
          });
      
          if (response.data.success) {
            console.log('Card learnVal updated successfully');
            
            const updatedSubset = { ...subsetData };
            updatedSubset.cards[currentIndex].isLearned = learnVal;
            setSubsetData(updatedSubset);
      
            // Recalculate learned percentage
            const learnedCount = updatedSubset.cards.filter(card => card.isLearned).length;
            const totalCount = updatedSubset.cards.length;
            const percentage = totalCount > 0 ? (learnedCount / totalCount) * 100 : 0;
            setLearnedPercentage(percentage);
      
          } else {
            console.error('Error updating learnVal:', response.data.message);
          }
        } catch (error) {
          console.error('Error updating learnVal:', error.message);
        }
    };
    
      const handleGood = () => {
        // updateCardLearnVal(true);
        handleNext(); // Go to the next card after the update
      };
    
      const handleBad = () => {
        // updateCardLearnVal(false);
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

}

export default FlearnContent;