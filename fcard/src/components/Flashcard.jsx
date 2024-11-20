import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import '../styles/flashcard.css';

const Flashcard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renameDialog, setRenameDialog] = useState({ isOpen: false, currentCategory: null });
  const [renameValue, setRenameValue] = useState('');

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1234/Cards/${userId}`);
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

  // Function to open the rename dialog
  const openRenameDialog = (category) => {
    setRenameDialog({ isOpen: true, currentCategory: category });
    setRenameValue(''); // Set initial value to the current name
    setOpenDropdown(null); // Close the dropdown
  };

  // Function to handle rename submission (including API call)
  const handleRenameSubmit = async () => {
    const { _id } = renameDialog.currentCategory;

    try {
      const response = await axios.put('http://localhost:1234/renameCard', {
        id: _id,
        name: renameValue,
      });

      if (response.data.success) {
        // Update data locally
        const updatedData = data.map((item) =>
          item._id === _id ? { ...item, name: renameValue } : item
        );
        setData(updatedData);
        setRenameDialog({ isOpen: false, currentCategory: null });
        setRenameValue('');
      } else {
        alert(response.data.message || 'Failed to rename the card');
      }
    } catch (error) {
      console.error('Error renaming the card:', error);
      alert('An error occurred while renaming the card.');
    }
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
          .filter((category) => (activeTab === 'active' ? !category.isArchived : category.isArchived))
          .map((category, index) => (
            <div className="Card" key={index}>
              <div className="flashcard--head">
                <Icon
                  icon="oi:ellipses"
                  onClick={() => toggleDropdown(index)}
                />
                {openDropdown === index && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => openRenameDialog(category)}>Rename</li>
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
                    {category.subsets.length - 1} Subsets{' '}
                    <span className="vertical-line"></span>
                    {category.statistics.totalCards} Flashcards
                  </h6>
                </div>
              </div>
            </div>
          ))}
      </section>

      
      {renameDialog.isOpen && (
        <div className="rename-dialog">
          <div className="dialog-content">
            <h4>Rename Category</h4>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              maxLength={15}
              placeholder="Enter new name"
            />
            <div className="dialog-actions">
              <button onClick={() => setRenameDialog({ isOpen: false, currentCategory: null })}>
                Cancel
              </button>
              <button onClick={handleRenameSubmit} disabled={!renameValue.trim()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
