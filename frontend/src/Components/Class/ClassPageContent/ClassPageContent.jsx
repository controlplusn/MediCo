import React, { useState, useEffect } from 'react';
import ClassPageHeader from './ClassPageHeader';
import ClassPage from './ClassPage';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/classpage.css';

export const ClassPageContent = () => {
    // fetch class id and username
    const { classId } = useParams();
    const [username, setUsername] = useState('');

    console.log("Class ID:", classId);

    // fetch username
    useEffect(() => {
        const fetchUsername = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/class/current-user', {
              withCredentials: true
            });
            if (response.data.success) {
              setUsername(response.data.data.username);
            }
          } catch (error) {
            console.error('Error fetching username:', error);
          }
        };
    
        fetchUsername();
    }, []);

    if (!username) {
      return <div>Loading...</div>;
    }
 

    return (
      <div className='classpage-container'>
        <ClassPageHeader />
        <hr/>
        <ClassPage classId={classId} username={username} />
      </div>
    );
};

export default ClassPageContent;