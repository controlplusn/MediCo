import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/cardside.css';

const Card = ({ card, onClick }) => (
  <div className="card" onClick={() => onClick(card)}>
    <div className="card-header">
      <h5>{card.question}</h5>
    </div>
    <h6>{card.answer}</h6>
  </div>
);

export const CardsSide = ({ setActiveCard, userId, cardSetId, subsetId }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:1234/Cards/${userId}`);
        const result = await response.json();
        
        if (!result.success) {
          console.error('Failed to fetch cards:', result.message);
          return;
        }
        

        // Find the card set with the specified cardSetId and subsetId
        const cardSet = result.data.find((set) => set._id === cardSetId);
        if (!cardSet) {
          console.error('Card set not found');
          return;
        }

        console.log(cardSet.subsets);
        const subset = cardSet.subsets.find((sub) => sub.subsetId === subsetId);
        if (!subset) {
          console.error('Subset not found');
          return;
        }

        // Set cards state with the subset cards
        setCards(subset.cards || []);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    if (userId && cardSetId && subsetId) {
      fetchCards();
    }
  }, [userId, cardSetId, subsetId]);

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
        {cards.length > 0 ? (
          cards.map((card) => (
            <React.Fragment key={card._id}> {/* Use _id for key */}
              <Card card={card} onClick={setActiveCard} />
              <hr />
            </React.Fragment>
          ))
        ) : (
          <p>No cards available in this subset.</p> // Display message if no cards
        )}
      </div>
    </div>
  );
};

export default CardsSide;
