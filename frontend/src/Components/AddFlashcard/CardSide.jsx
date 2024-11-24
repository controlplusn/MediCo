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

const CardSide = ({ setActiveCard, userId, categoryId, subsetId }) => {
    const [cards, setCards] = useState([]);

    // fetching cards data
    useEffect(() => {
        const fetchCards = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}/${subsetId}`, {
              withCredentials: true
            });
            
            if (!response.data.success) {
              console.error('Failed to fetch cards:', response.data.message);
              return;
            }
            
            setCards(response.data.data.cards || []);
          } catch (error) {
            console.error('Error fetching cards:', error);
          }
        };
    
        if (userId && categoryId && subsetId) {
          fetchCards();
        }
      }, [userId, categoryId, subsetId]);
    
      const handleAddClick = () => {
        setActiveCard(null);
      };

    return (
        <div className="fcards-container">
            <div className="fcards-header">
              <button onClick={handleAddClick}>
                <Icon icon="material-symbols:add" />
              </button>
            </div>
            <div className="cards-list">
              {cards.length > 0 ? (
                cards.map((card) => (
                  <React.Fragment key={card.CardId}>
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
}

export default CardSide;