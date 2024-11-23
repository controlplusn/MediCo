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

export const CardSide = () => {
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Sate for categories, activeCategory, and activeSubset
  const [categories, setCategories] = useState([]); 
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubset, setActiveSubset] = useState(null);

  // used for userId passed from api JWT authentication
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

  // fetch category id and subset id
  useEffect(() => {
    const fetchCategoryData = async () => {

      if (!userId) {
        console.error('No userId available');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/flashcard/cards`, {
          withCredentials: true
        });

        if (response.data.success) {
          setCategories(response.data.data);
          const firstCategory = response.data.data[0];
          if (firstCategory) {
            setActiveCategory(firstCategory._id);
            const firstSubset = firstCategory.subsets[0];
            if (firstSubset) {
              setActiveSubset(firstSubset.subsetId);
            }
          }

        } else {
          setError(new Error(response.data.message));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCategoryData();
    }
  }, [userId]);

  useEffect(() => {
      if (activeCategory) {
        const fetchCards = async () => {
          try {
            const subsetId = activeSubset === 'All Subsets' ? 'All Subsets' : activeSubset;
            const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${activeCategory}/${subsetId}`, {
              withCredentials: true,
            });
            console.log(response);

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
   
        fetchCards();
      }
  }, [activeCategory, activeSubset]);

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
        ) : cards.length > 0 ? (
            cards.map((card) => (
              <React.Fragment key={card._id}> {/* Use _id for key */}
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