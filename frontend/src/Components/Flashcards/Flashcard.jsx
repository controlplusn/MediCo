import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../../styles/flashcards.css';

const Flashcard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks which dropdown is open
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // rename
  const [renameDialog, setRenameDialog] = useState({ isOpen: false, currentCategory: null });
  const [renameValue, setRenameValue] = useState('');
  const [createDialog, setCreateDialog] = useState(false); 
  const [newCategoryName, setNewCategoryName] = useState('');

  const navigate = useNavigate();

  // fetch userId
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


  const handleCreateFlashcard = async () => {// Or select from the dropdown or form field
    try {
      const response = await axios.post('http://localhost:3001/api/flashcard/cards/add', {
        collectionName: newCategoryName, // Collection name from input field
        question: 'Sample question', // You can add inputs for question and answer
        answer: 'Sample answer'
      });
  
      if (response.data.success) {
        // Add the new flashcard to the local state
        setData(prevData => [...prevData, response.data.collection]);
        setCreateDialog(false);
        setNewCategoryName('');
      } else {
        alert('Failed to add flashcard');
      }
    } catch (error) {
      console.error('Error adding flashcard:', error);
      alert('An error occurred while adding the flashcard.');
    }
  };


  // Function to toggle the archived state of a category
const handleArchiveToggle = async (category) => {
  const { _id, isArchived } = category;

  try {
    const response = await axios.put('http://localhost:3001/api/flashcard/updateArchiveStatus', {
      id: _id,
      isArchived: !isArchived, // Toggle the archive state
    });

    if (response.data.success) {
      // Update the local state
      const updatedData = data.map((item) =>
        item._id === _id ? { ...item, isArchived: !isArchived } : item
      );
      setData(updatedData);
      console.log(`Category ${isArchived ? 'unarchived' : 'archived'} successfully!`);
    } else {
      alert('Failed to update archive status');
    }
  } catch (error) {
    console.error('Error updating archive status:', error);
    alert('An error occurred while updating archive status.');
  }

  closeDropdown();
};


  // Function to toggle the dropdown visibility for a specific card
  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // close dropdown function
  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Function to open the rename dialog
  const openRenameDialog = (category) => {
    console.log("Opening rename dialog for category:", category);

    if (!category._id) {
        console.error("The category does not have an _id:", category);
    } else {
        console.log("The category ID is:", category._id);
    }

    setRenameDialog({ isOpen: true, currentCategory: category });
    setRenameValue(category.name); // Set initial value to the current name
    closeDropdown(); 
  };

  const openCreateDialog = () => {
    setCreateDialog(true);
  };

  // Function to handle rename submission (including API call)
  const handleRenameSubmit = async () => {
    if (!renameDialog.currentCategory) {
      alert('No card selected for renaming');
      return;
    }

    const { _id } = renameDialog.currentCategory;

    try {
      const response = await axios.put('http://localhost:3001/api/flashcard/renameCard', {
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

    closeDropdown();
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this collection?");
  
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3001/api/flashcard/cards/delete/${categoryId}`, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        // Update the UI by removing the deleted collection from the data state
        setData(data.filter((category) => category._id !== categoryId));
        console.log("Collection deleted successfully!");
      } else {
        console.log("Failed to delete the collection.");
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      console.log('An error occurred while deleting the collection.');
    }

    closeDropdown();

  }

  // Handle card click and navigate to category page
  const handleCardClick = (categoryId) => {
    navigate(`/flashcardcontent/${categoryId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flashcard-page-container">
      <Sidebar />

      <div className="flashcard--container">  
      
      <div className="flashcard--header">
        <h4>Flash Cards</h4>
      </div>

      <div className="flashcard--nav--con">
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
        <button onClick={() => openCreateDialog({})}>
          <h5 style={{ margin: '0 5px 0 0', padding: '8px' }}>Add</h5>
          <div>
            <Icon icon="ic:twotone-plus" />
          </div>
        </button>
      </div>

      <section className="Card--section">
        {data
          .filter(category => (activeTab === 'active' ? !category.isArchived : category.isArchived))
          .map((category, index) => (
            <div className="Card" key={index} onClick={() => handleCardClick(category._id)}>
              <div className="flashcard--head">
                <Icon
                  icon="oi:ellipses"
                  onClick={(e) => toggleDropdown(index, e)} // Pass index to toggleDropdown
                  />
                {openDropdown === index && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={(e) => {e.stopPropagation(); openRenameDialog(category)}}>Rename</li>
                      <hr className="borderline" />
                      <li>Quiz</li>
                      <hr className="borderline" /> 
                      <li onClick={(e) => { 
                          e.stopPropagation(); 
                          handleArchiveToggle(category); 
                      }}>
                        {category.isArchived ? 'Unarchive' : 'Archive'}
                      </li>
                      <hr className="borderline" />
                      <li onClick={(e) => {e.stopPropagation(); handleDelete(category._id)}}>Delete</li>
                      <hr className="borderline" />
                      <li>Share</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flashcard--body">
                <h5>{category.name}</h5>
                <progress 
                  value={category.statistics?.learnedPercentage || 0} 
                  max={100}>
                </progress>
                <div className="content--h6">
                  <h6>
                    {category.subsets?.filter(subset => subset.subsetName != "All Subsets").length || 0} Subsets{' '}
                    <span className="vertical-line"></span>
                    {category.statistics?.totalCards || 0} Flashcards
                  </h6>
                </div>
              </div>
            </div>
          ))}
      </section>

      {/* Rename Dialog */}
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

      {/* Create Dialog */}
      {createDialog && (
        <div className="create-dialog">
          <div className="dialog-content">
            <h4>Create New Flashcard</h4>
            <label htmlFor="category-name">Flashcard Name:</label>
            <input
              id="category-name"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              maxLength={15}
              placeholder="Enter flashcard name"
            />
            <div className="dialog-actions">
              <button onClick={() => setCreateDialog(false)}>Cancel</button>
              <button
                onClick={handleCreateFlashcard}
                disabled={!newCategoryName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
};

export default Flashcard;