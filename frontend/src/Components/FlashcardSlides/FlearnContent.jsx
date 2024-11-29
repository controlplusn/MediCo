import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Icon } from '@iconify/react';

const FlearnContent = ({ subsetId, categoryId }) => {

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
          if (!userId) return;

          try {
            setLoading(true); // Start loading

            const response = await axios.get(`http://localhost:3001/api/flashcard/cards`, {
              withCredentials: true,
            });

            console.log('API Response:', response.data);

            if (response.data.success) {
                const allCards = []; // This will store the cards based on the subsetId

                if (subsetId === 'all') {
                    // If 'all' is selected, fetch all cards across all subsets
                    const category = response.data.data.find(cat => cat._id === categoryId);
    
                    if (category) {
                        // Iterate through each subset in the category
                        category.subsets.forEach(subset => {
                            // Add all the cards from each subset to the allCards array
                            allCards.push(...subset.cards);
                        });
                
                        console.log('All Cards:', allCards);
                        setFlashcard(allCards); // Set all cards as flashcard data
                }} else {
                    // Fetch cards from a specific subset
                    const category = response.data.data.find(cat => cat._id === categoryId);
                    console.log('Category:', category.subsets);

                    if (category) {
                        const subset = category.subsets.find(subset => subset.subsetId === subsetId);
                        
                        if (subset) {
                            setSubsetData(subset);
                            setLearnedPercentage(parseFloat(subset.statistics.learnedPercentage));
                            console.log('Subset Cards:', subset.cards);
                            setFlashcard(subset.cards); // Only set the cards of the specific subset
                        } else {
                            setError(new Error('Subset not found'));
                        }
                    } else {
                        setError(new Error('Category not found'));
                    }
                }

                // Calculate learned percentage for all cards in 'all' case
                if (subsetId === 'all') {
                    const category = response.data.data.find(cat => cat._id === categoryId);
                    //console.log('learned %;', category.statistics.learnedPercentage);
                    setLearnedPercentage(category.statistics.learnedPercentage);
                }

            } else {
                setError(new Error(response.data.message || 'Failed to fetch flashcard data'));
            }
          } catch (error) {
            console.error('Error fetching flashcards:', error);
            setError(error);
          } finally {
            setLoading(false); // End loading
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

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (!flashcard || flashcard.length === 0) {
        return <div>No flashcards available</div>;
    }

    const handleNext = () => {
        if (currentIndex < flashcard.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Loop back to the beginning
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(flashcard.length - 1); // Loop back to the end
        }
    };
    
    const updateCardLearnVal = async (learnVal) => {
      if (!flashcard) {
          console.error("Flashcard data is not available");
          return;
      }
  
      const cardId = flashcard[currentIndex].cardId; // Assuming each card has its own _id
      
      console.log("cardId:", cardId);
      console.log("subsetId:", subsetId);
      console.log("categoryId:", categoryId);
  
      try {
          // Update API URL with cardSetId, subsetId, and cardId
          const response = await axios.put(
              `http://localhost:3001/api/flashcard/UpdateLearn/${categoryId}/${subsetId}/${cardId}`,
              { learnVal }, // Send the updated learnVal in the body
              { withCredentials: true } // Ensure credentials are included (for auth)
          );
  
          if (response.data.success) {
              console.log('Card learnVal updated successfully');
  
              // Update the flashcard state locally after successful update
              const updatedCards = [...flashcard];
              updatedCards[currentIndex].isLearned = learnVal; // Update the card's learnVal status
              setFlashcard(updatedCards); // Set the updated flashcard array
  
              // Recalculate learned percentage
              const learnedCount = updatedCards.filter(card => card.isLearned).length;
              const percentage = updatedCards.length > 0 ? (learnedCount / updatedCards.length) * 100 : 0;
              setLearnedPercentage(percentage);
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
            <h5>{flashcard[currentIndex].subsetName}</h5>

            <label>
                <div className="tagname">
                    {flashcard[currentIndex].isLearned ? <h6>Learned</h6> : <h6>On Progress</h6>}
                </div>
            </label>

            <progress value={learnedPercentage} max={100} />

            <div className="qna--container">
              <h6>{flashcard[currentIndex].question}</h6>
            </div>

            <hr className="borderline" />
            <div className="prevnnext">
              <Icon icon="ep:arrow-left" onClick={handlePrevious} />
              <h5>{flashcard[currentIndex].answer}</h5>
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
