import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import '../../styles/flashcards.css';

const Flashcard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks which dropdown is open
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${userId}`);
        setData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Function to toggle the dropdown visibility for a specific card
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            <div className="Card" key={index}>
              <div className="flashcard--head">
                <Icon
                  icon="oi:ellipses"
                  onClick={() => toggleDropdown(index)} // Pass index to toggleDropdown
                />
                {openDropdown === index && (
                  <div className="dropdown-menu">
                    <ul>
                      <li>Rename</li>
                      <hr className="borderline" />
                      <li>Quiz</li>
                      <hr className="borderline" />
                      <li>Archived</li>
                      <hr className="borderline" />
                      <li>Delete</li>
                      <hr className="borderline" />
                      <li>Share</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flashcard--body">
                <h5>{category.name}</h5>
                <progress value={category.statistics.learnedPercentage} max={100}></progress>
                <div className="content--h6">
                  <h6>
                    {category.subsets.length} Subsets{' '}
                    <span className="vertical-line"></span>
                    {category.statistics.totalCards} Flashcards
                  </h6>
                </div>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Flashcard;