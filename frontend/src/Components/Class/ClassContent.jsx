import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../../styles/classcontent.css';
import doctorImage2 from '../../assets/50d429ea5c9afe0ef9cb3c96f784bea4.jpg';



const ClassContent = () => {
    const [username, setUsername] = useState('');
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownState, setDropdownState] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newClassTitle, setNewClassTitle] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);

    // Fetch current user data
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/class/current-user', {
          withCredentials: true
        });

        console.log('Fetch user response:', response.data.data);

        if (response.data.success) {
          setUsername(response.data.data.username);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      }
    };

    // fetch class data
    const fetchClassData = async () => {
      if (!username) return;
      setLoading(true);
      console.log("username on fetch:", username);

      try {
        const response = await axios.get(`http://localhost:3001/api/class/${username}`, {
          withCredentials: true
        });
        if (response.data.success) {
          setClassData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching class data:', err);
        setError('Failed to fetch class data');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCurrentUser();
    }, []);

    useEffect(() => {
      if (username) {
        fetchClassData();
      }
    }, [username]);

    // Add a new class
    const handleAddClass = async () => {
      console.log('New class title:', newClassTitle);

      if (!newClassTitle.trim()) return;

      try {
        const response = await axios.post(`http://localhost:3001/api/class/addClass`, {
          title: newClassTitle
        }, { withCredentials: true });

        if (response.data.success) {
          fetchClassData();
          setIsModalOpen(false);
          setNewClassTitle('');
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error adding class:', err);
        setError('Failed to add class. Please try again.');
      }
    };

    // Edit a class
    const handleEditClass = async () => {
      console.log("Editing class with ID:", selectedClass._id);
      
      if (!newClassTitle.trim() || !selectedClass) return;
      try {
        const response = await axios.put(`http://localhost:3001/api/class/editClass/${selectedClass._id}`, {
          title: newClassTitle,
        }, { withCredentials: true });
    
        if (response.data.success) {
          fetchClassData();
          setIsEditModalOpen(false);
          setNewClassTitle('');
          setSelectedClass(null);
        } else {
          setError(response.data.message || 'Failed to edit class. Please try again.');
        }
      } catch (err) {
        console.error('Error editing class:', err);
        setError('Failed to edit class. Please try again.');
      }
    };


    // Delete a class
    const handleDeleteClass = async () => {
      if (!selectedClass) return;
      try {
        const response = await axios.delete(`http://localhost:3001/api/class/deleteClass/${selectedClass._id}`, {
          withCredentials: true
        });
    
        if (response.data.success) {
          fetchClassData();
          setIsDeleteModalOpen(false);
          setSelectedClass(null);
        } else {
          setError(response.data.message || 'Failed to delete class. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting class:', err);
        setError('Failed to delete class. Please try again.');
      }
    };


    // Toggle dropdown -> UI interaction
    const toggleDropdown = (id) => {
      setDropdownState((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="add-icon">
              <button onClick={() => setIsModalOpen(true)}>
                <Icon icon="material-symbols:add" />
              </button>
            </div>

            {/* Add Modal */}
            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Add New Class</h2>
                    <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                      <Icon icon="material-symbols:close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      placeholder="Class Title"
                      value={newClassTitle}
                      onChange={(e) => setNewClassTitle(e.target.value)}
                    />
                    <button onClick={handleAddClass}>Add Class</button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Edit Class</h2>
                    <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                      <Icon icon="material-symbols:close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      placeholder="New Class Title"
                      value={newClassTitle}
                      onChange={(e) => setNewClassTitle(e.target.value)}
                    />
                    <button onClick={handleEditClass}>Save</button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Delete Class</h2>
                    <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                      <Icon icon="material-symbols:close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to delete this class?</p>
                    <button onClick={handleDeleteClass}>Yes</button>
                    <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Class Cards */}
            <section className="Card--section">
              {classData.map((card) => (

                <Link to={`/class/classcontent/${card._id}`}>
                    <button className="Card" key={card._id}>
                      <div className="flashcard--head">
                      <img src={doctorImage2} alt="human doctor" />
                      <button onClick={(e) =>  {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDropdown(card._id)
                        }}>
                          <Icon icon="oi:ellipses" />
                        </button>
                        {dropdownState[card._id] && (
                          <div className="dropdown-menu">
                            <ul>
                              <li
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedClass(card);
                                  setNewClassTitle(card.title);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                Edit  
                              </li>
                              <li
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedClass(card);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flashcard--body">
                        <h5>{card.title}</h5>
                        <div className="content--h6">
                          <h6>By {card.host}</h6>
                        </div>
                      </div>
                    </button>
                </Link>

              ))}
          </section>
    </div>
  );
}

export default ClassContent;