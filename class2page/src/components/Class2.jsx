import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Classheader from './Classheader.jsx';
import Class2Content from './Class2Content.jsx';

export const Class2 = ({ username, classId }) => {
  const [classData, setClassData] = useState(null); // State to hold class data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch class data function
  const fetchClassData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/classes/${username}/${classId}`);
      setClassData(response.data); // Set the fetched data to state
      setLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError('Failed to fetch class data'); // Set error state in case of failure
      setLoading(false); // Set loading to false even on error
    }
  };

  // Fetch class data when the component mounts or when the username/classId changes
  useEffect(() => {
    fetchClassData();
  }, [username, classId]);

  const updateClassData = () => {
    fetchClassData(); // Refetch class data after updating it
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there was an issue with the fetch
  }

  return (
    <div>
      <Classheader />
      <Class2Content data={classData} username={username} updateClassData={updateClassData} />
    </div>
  );
};

export default Class2;
