import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

const FlearncardContent = ({ activeSubset, categoryId, category }) => {

    const [flashcard, setFlashcard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

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

    // fetch flashcard data
    useEffect(() => {
        const fetchFlashcardData = async () => {
            if (!userId || !categoryId) return;

            try {
                const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}`, {
                    withCredentials: true,
                });

                if (response.data.success) {
                    setFlashcard(response.data.data);
                    console.log('Fetched Flashcard:', response.data.data);
                } else {
                    setError(new Error(response.data.message || 'Failed to fetch flashcard data'));
                }
            } catch (err) {
                console.error('Error fetching flashcard data:', err);
                setError(new Error('Error fetching flashcard data'));
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcardData();
    }, [userId, categoryId]);

    // loading and error handling
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!flashcard) return <div>No flashcard data available</div>;

    // Data processing
    const activeSubsetData =
        activeSubset === 'All Subsets'
            ? null
            : flashcard.subsets?.find(subset => subset.subsetName === activeSubset);

    const allCards = flashcard.subsets?.flatMap(subset => subset.cards) || [];

    const noCardsAvailable = activeSubset === 'All Subsets'
        ? !allCards || allCards.length === 0
        : activeSubsetData && (!activeSubsetData.cards || activeSubsetData.cards.length === 0);

    // AddCard component navigate
    const handleAddCard = () => {
        console.log('Active Subset:', activeSubset);
        console.log('Category ID:', categoryId);
        console.log('Flashcard Data:', flashcard);

        const subsetId = activeSubset === 'All Subsets' 
            ? flashcard.subsets[0]._id  // Default to first subset if 'All Subsets' is selected
            : flashcard.subsets.find(subset => subset.subsetName === activeSubset)?._id;
        
        console.log('Selected Subset ID:', subsetId);   

        if (categoryId && subsetId) {
            console.log('Navigating to:', `/flashcardcollection/${categoryId}/${subsetId}`);
            navigate(`/flashcardcollection/${categoryId}/${subsetId}`);
        } else {
            console.error('Missing categoryId or subsetId');
            if (!categoryId) console.error('categoryId is missing or invalid');
            if (!subsetId) console.error('subsetId is missing or invalid');
        }
    };

    // Render logic
    if (!flashcard.statistics || flashcard.statistics.totalCards === 0) {
        return (
            <div className="flearn--content">
                <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
                    <button onClick={handleAddCard}>
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