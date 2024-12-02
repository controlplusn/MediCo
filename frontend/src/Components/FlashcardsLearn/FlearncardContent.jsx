import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const FlearncardContent = ({ activeSubset, categoryId}) => {
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

                console.log('API Response:', response.data);

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

    console.log('Current flashcard state:', flashcard);

    // loading and error handling
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!flashcard) {
        console.log('Flashcard is null or undefined');
        return <div>No flashcard data available</div>;
    }
    

    // Data processing
    const activeSubsetData = activeSubset.id === 'all'
        ? null
        : flashcard?.subsets?.find(subset => subset._id === activeSubset.id);

    const allCards = flashcard?.subsets?.flatMap(subset => subset.cards) || [];

    const cardsToDisplay = activeSubset.id === 'all' ? allCards : activeSubsetData?.cards || [];

    const noCardsAvailable = cardsToDisplay.length === 0;

    // AddCard component navigate
    const handleAddCard = () => {
        console.log('Active Subset:', activeSubset);
        console.log('Category ID:', categoryId);
        console.log('Flashcard Data:', flashcard);

        const subsetId = activeSubset.id === 'All Subsets' 
            ? flashcard.subsets[0]?._id  // Default to first subset if 'All Subsets' is selected
            : activeSubset.id;
        
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

    console.log('Cards to display:', cardsToDisplay);

    console.log('Flashcard before render:', flashcard);
    console.log('Flashcard statistics:', flashcard.statistics);

    // Render logic
    if (!flashcard || !flashcard.statistics) {
        console.log('No statistics available or totalCards is undefined');
        return (
            <div className="flearn--content">
                <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
                
            </div>
        );
    }

    return (
        <section>
            {cardsToDisplay.length === 0 ? (
            <div className="left--sideflearn">
                <img src="../assets/flearnimage.jpg" alt="Anatomy graphic" />
                <h4>No cards available for the selected subset.</h4>
            </div>
        ) : (
            <div className="CardFlearn--Container">
                {cardsToDisplay.map(card => (
                    <div key={card._id || card.cardId} className="Card--flearn">
                        <label>
                            <div className="tagname">
                                <h6>{card.isLearned ? "Learned" : "On Progress"}</h6>
                            </div>
                        </label>
                        <h4 className="labelh4">Question: {card.question}</h4>
                        <hr style={{ width: '100%' }} />
                        <h4 className="labelh4">Answer: {card.answer}</h4>
                    </div>
                ))}
            </div>
        )}
        </section>
    );
};

export default FlearncardContent;