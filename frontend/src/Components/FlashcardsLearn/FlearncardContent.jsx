import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';


const FlearncardContent = ({ activeSubset }) => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [flashcard, setFlashcard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}`);
                

            if (response.data.success) {
              setCategoryData(response.data.data);
            } else {
              setError(new Error(response.data.message));
            }
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCategoryData();
    }, [categoryId]); 

    // Find the active subset based on the activeSubset prop
    const activeSubsetData =
    activeSubset === 'All Subsets'
        ? null // Handle case for "All Subsets"
        : flashcard?.subsets?.find(subset => subset.subsetName === activeSubset);

    // Flatten all cards if "All Subsets" is selected
    const allCards =
        activeSubset === 'All Subsets'
        ? flashcard?.subsets?.flatMap(subset => subset.cards)
        : null;

    // Check if there are no cards in the selected subset or all subsets
    const noCardsAvailable = activeSubset === 'All Subsets'
        ? !allCards || allCards.length === 0
        : activeSubsetData && (!activeSubsetData.cards || activeSubsetData.cards.length === 0);
    
    if (!flashcard || flashcard.statistics.totalCards === 0) {
        return (
            <div className="flearn--content">
                <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
                <button>
                    Add <Icon icon="material-symbols-light:add" />
                </button>
            </div>
        );
    }


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <section>
            {noCardsAvailable ? (
                <div>
                    <h4>No cards available for the selected subset.</h4>
                </div>
            ) : activeSubset === 'All Subsets' ? (
                <div className="Card--Container">
                    {allCards?.map(card => (
                        <div key={card.cardId} className="Card">
                            <label>
                                <div className="tagname">
                                    {card.isLearned ? <h6>Learned</h6> : <h6>On Progress</h6>}
                                </div>
                            </label>
                            <h4>Question: {card.question}</h4>
                            <hr style={{ width: '100%' }} />
                            <h4>Answer: {card.answer}</h4>
                        </div>
                    ))}
                </div>
            ) : activeSubsetData ? (
                <div className="Card--Container">
                    {activeSubsetData.cards.map(card => (
                        <div key={card.cardId} className="Card">
                            <label>
                                <div className="tagname">
                                    {card.isLearned ? <h6>Learned</h6> : <h6>On Progress</h6>}
                                </div>
                            </label>
                            <h4>Question: {card.question}</h4>
                            <hr style={{ width: '100%' }} />
                            <h4>Answer: {card.answer}</h4>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h4>No cards available for the selected subset.</h4>
                </div>
            )}
        </section>
    );
}

export default FlearncardContent;