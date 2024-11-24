import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import '../../styles/addcard.css';
import CardContentAdd from './CardContentAdd';

const AddCard = () => {
    const { categoryId, subsetId } = useParams(); // getting the categoryId and subsetId from the url
    console.log(`Params in AddCard: ${ categoryId }, ${ subsetId }`);
    const [userId, setUserId] = useState(null);

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



    return (
      <CardContentAdd userId={userId} categoryId={categoryId} subsetId={subsetId} />
    )
}

export default AddCard;