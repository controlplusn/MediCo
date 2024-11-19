import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import '../styles/flashcard.css';

const Flashcard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('active');  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]); // State to hold fetched data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1234/Cards/${userId}`);
        setData(response.data.data); // Set the data from the response
      } catch (err) {
        setError(err); // Set error if the request fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [userId]); // Dependency array to refetch if username changes

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div>Error: {error.message}</div>; // Error state

  return (
    <div className="flashcard--container">
      <div className="flashcard--header">
        <h4>Flash Cards</h4>
      </div>

      <div className="flashcard--navbar">
        <h6 
          onClick={() => setActiveTab('active')} 
          className={activeTab === 'active' ? 'active' : ''}
        >
          Active
        </h6>
        <h6 
          onClick={() => setActiveTab('archived')} 
          className={activeTab === 'archived' ? 'active' : ''}
        >
          Archived
        </h6>
      </div>

      <section className="Card--section">
        {data
          .filter(category => (activeTab === 'active' ? !category.isArchived : category.isArchived))
          .map((category, index) => (
            <button className="Card" key={index}>
              <div className="flashcard--head">
                <Icon 
                  icon="oi:ellipses" 
                  onClick={toggleDropdown} 
                />
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li>Rename</li>
                      <hr className="borderline"/>
                      <li>Quiz</li>
                      <hr className="borderline"/>
                      <li>Archived</li>
                      <hr className="borderline"/>
                      <li>Delete</li>
                      <hr className="borderline"/>
                      <li>Share</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flashcard--body">
                <h5>{category.name}</h5>
                <progress value={category.statistics.learnedPercentage} max={100}></progress>
                <div className="content--h6">
                  <h6>{category.subsets.length} Subsets <span className="vertical-line"></span>{category.statistics.totalCards} Flashcards</h6>
                </div>
              </div>
            </button>
          ))}
      </section>

    </div>
  );
};

export default Flashcard;