import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../../styles/card.css';

const Card = () => {
  const navigate = useNavigate(); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

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
      console.log("UserID: ",userId)
        // Fetch data from the API
  useEffect(() => {
    if (userId) {
      // Only fetch the cards if userId is available
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/flashcard/cards`, {
            params: { userId },
            withCredentials: true
          });

          console.log("Fetched data:", response.data.data);
  
          if (response.data.success) {
            setData(response.data.data); // Set the data in state
            console.log("Data:", data);
          } else {
            console.error("Failed to fetch data:", response.data.message);
            setError(new Error(response.data.message));
          }
  
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }
  }, [userId]);

  const handleCardClick = (itemId) => {
    navigate(`/flashcardcontent/${itemId}`); // Navigate to the specified URL
};

    return (
        <div className="card--container">
            <h5 className="card--header">Recent Task</h5>
            <div className="cards">
                {data && data.length > 0 ? (
                    [...data]
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by most recent
                    .slice(0, Math.min(data.length, 3)) // Select top 1, 2, or 3 cards
                    .map((item) => (
                    
                        <button
                        key={item._id}
                        className="card--item"
                        onClick={() => handleCardClick(item._id)}
                        >
                        <h2>{item.name}</h2>
                        <progress
                            value={parseFloat(item.statistics.learnedPercentage) / 100}
                            max={1}
                        ></progress>
                        <h5>
                            {item.subsets?.filter(subset => subset.subsetName != "All Subsets").length || 0} Subsets{' '}
                            <span className="vertical-line"></span>{" "}
                            {item.statistics?.totalCards || 0} Flashcards
                        </h5>
                        </button>
                    ))
                ) : (
                    <div className="no-recent-task">No recent tasks</div>
                )}
                </div>
        </div>
    );
};

export default Card;