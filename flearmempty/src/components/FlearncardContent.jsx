import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';

export const FlearncardContent = ({ activeSubset }) => {
    const [flashcard, setFlashcard] = useState(null);
    const userId = '672ca9b1572b8a9dad197f4c';
    const FlashcardId = '5f8d0c2b9d1e8e1a4e5f1015';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:1234/Cards/${userId}`);
                const data = response.data.data.find(flashcard => flashcard._id === FlashcardId);

                if (data) {
                    setFlashcard(data);
                    console.log('Fetched Flashcard:', data);
                } else {
                    setError(new Error('Flashcard not found.'));
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, FlashcardId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

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

    if (flashcard.statistics.totalCards === 0) {
        return (
            <div className="flearn--content">
                <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
                <button>
                    Add <Icon icon="material-symbols-light:add" />
                </button>
            </div>
        );
    }

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
};

export default FlearncardContent;
