import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

const FlearncardContent = ({ activeSubset }) => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
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
    }, [categoryId, activeSubset]); 

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // If there's no category data or no subsets
    if (!categoryData || !categoryData.subsets) {
        return (
            <div className="flearn--content">
                <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
                <Link to="/flashcardcollection">
                    <button>
                        Add <Icon icon="material-symbols-light:add" />
                    </button>
                </Link>
            </div>
        );
    }

    // Get cards based on active subset
    const getCardsToDisplay = () => {
        if (activeSubset === 'All Subsets') {
            return categoryData.subsets.flatMap(subset => subset.cards || []);
        }
        const activeSubsetData = categoryData.subsets.find(subset => subset.subsetName === activeSubset);
        return activeSubsetData?.cards || [];
    };

    const cardsToDisplay = getCardsToDisplay();

    if (cardsToDisplay.length === 0) {
        return (
            <div className="flearn--content">
                <h4>No cards available for {activeSubset}</h4>
                <Link to="/flashcardcollection">
                    <button>
                        Add <Icon icon="material-symbols-light:add" />
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="Card--Container">
            {cardsToDisplay.map(card => (
                <div key={card._id || card.cardId} className="Card">
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
    );
};

export default FlearncardContent;