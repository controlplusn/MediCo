import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import '../../styles/cardside.css';

const Card = ({ card, onClick }) => (
  <div className="card" onClick={() => onClick(card)}>
    <div className="card-header">
      <h5>{card.question}</h5>
    </div>
    <h6>{card.answer}</h6>
  </div>
);

export const CardSide = ({ setActiveCard, userId, categories, activeCategory, activeSubset, onCategoryChange, onSubsetChange }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      if (activeCategory && activeSubset) {
        const fetchCards = async () => {

          if (!userId) {
            console.error('No userId available');
            return;
          }

          try {
            const subsetId = activeSubset === 'All Subsets' ? 'All Subsets' : activeSubset;
            const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${activeCategory}/${subsetId}`, {
              withCredentials: true,
            });
            console.log("Response:", response);

            const result = response.data; 
            console.log('Fetched cards:', result);
            
            if (result.success && result.data && result.data.cards && result.data.cards.length > 0) {
              console.log('Cards:', result.data.cards); 
              setCards(result.data.cards);
            } else {
              setError('No subsets or cards available');
              setCards([]);
            }
          } catch (error) {
            console.error('Error fetching cards:', error);
            setError('Failed to fetch cards');
          } finally {
            setLoading(false);
          }
        };
        
        if (userId) {
          fetchCards();
        }
      }
  }, [activeCategory, activeSubset, userId]);

  const handleAddClick = () => {
    setActiveCard(null); // "Add" button clicked, no active card
  };

  return (
    <div className="fcards-container">
      <div className="fcards-header">
        <button onClick={handleAddClick}>
          <Icon icon="material-symbols:add" />
        </button>
      </div>
      <div className="cards-list">
      {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <React.Fragment key={card._id}>
              <Card card={card} onClick={setActiveCard} />
              <hr />
            </React.Fragment>
          ))
        ) : (
          <p>No cards available in this subset.</p>
        )}
      </div>
    </div>
  );
};

export default CardSide;