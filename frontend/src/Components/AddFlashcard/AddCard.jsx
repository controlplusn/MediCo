import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import '../../styles/addcard.css';
import CardContentAdd from './CardContentAdd';
import CardSide from './CardSide';

const AddCard = () => {
    const { categoryId, subsetId } = useParams(); // getting the categoryId and subsetId from the url
    const [userId, setUserId] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [cardUpdateTrigger, setCardUpdateTrigger] = useState(0);

    // fetch authenticated user id
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
                    withCredentials: true,
                });
                if (response.data.user) {
                    setUserId(response.data.user._id);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    const triggerCardUpdate = () => {
        setCardUpdateTrigger(prev => prev + 1);
    };



    return (
        <div className="addcrd-container">
            <CardSide 
                setActiveCard={setActiveCard} 
                userId={userId} 
                categoryId={categoryId} 
                subsetId={subsetId}
                triggerCardUpdate={triggerCardUpdate}
                cardUpdateTrigger={cardUpdateTrigger}
            />
            <CardContentAdd 
                userId={userId} 
                categoryId={categoryId} 
                subsetId={subsetId} 
                activeCard={activeCard} 
                triggerCardUpdate={triggerCardUpdate}
            />
        </div>
    )
}

export default AddCard;