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

const CardSide = ({ setActiveCard, userId, categoryId, subsetId, triggerCardUpdate, cardUpdateTrigger }) => {
    const [cards, setCards] = useState([]);
    
    // fetching cards data
    useEffect(() => {
        const fetchCards = async () => {
          try {
            
            const response = subsetId !== 'all'
            ? await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}/${subsetId}`, {//this will fetch the specific card set
                withCredentials: true
              })
            : await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}`, { // this will fetch all cards
                withCredentials: true
              });
            if (!response.data.success) {
              console.error('Failed to fetch cards:', response.data.message);
              return;
            }
            
            if(subsetId === 'all'){
              const allCards = response.data.data.subsets.reduce((acc, subset) => {
                return acc.concat(subset.cards); // Add all cards from each subset
            }, []);
        
            setCards(allCards); // Set the combined list of all cards
            console.log(`Fetching all cards\n Cards:`, allCards);
            }
            else{
              setCards(response.data.data.cards || []);
              console.log(`Fetching cards for subsetId: ${subsetId} \n Cards:`, response.data.data.cards);
            }

            
          } catch (error) {
            console.error('Error fetching cards:', error);
          }
        };
    
        if (userId && categoryId && subsetId) {
          fetchCards();
        }
      }, [userId, categoryId, subsetId, cardUpdateTrigger]);
    
      const handleAddClick = () => {
        setActiveCard(null);
      };
    

    return (
        <div className="fcards-container">
            <div className="fcards-header">
              <button onClick={handleAddClick}>
                <Icon icon="material-symbols:add" />
              </button>

              <h3>Flashcards</h3>
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