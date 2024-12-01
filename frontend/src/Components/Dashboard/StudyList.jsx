import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CircularProgressbar } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css'; 
import '../../styles/studylist.css';
import axios from 'axios';

const StudyList = () => {   
    const [studyList, setStudyList] = useState([]); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [flashcardOptions, setFlashcardOptions] = useState([]);

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

  
          if (response.data.success) {
            setData(response.data.data); // Set the data in state
            const sortedData = response.data.data.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setFlashcardOptions(sortedData); //setting sorted data for card options

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

    // Function to fetch data from the API
    const fetchStudyList = async () => {
        if (!userId) {
            console.error('No userId available');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/api/studylists/studylist`, {
                withCredentials: true,
            });
            console.log('Fetch study response:', response);

            if (response.data.success) {
                setStudyList(response.data.data); 
            } else {
                console.error('Failed to fetch study list:', response.data.message);
            }

        } catch (err) {
            console.error('Error fetching study list:', err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchStudyList();
        }
    }, [userId]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    

    const typeOptions = ['Quiz', 'Exam', 'Activity', 'Others'];

    const [formData, setFormData] = useState({
        date: '',
        subject: '',
        type: typeOptions[0], // Default to the first type
        flashcards: '', // Set to an empty string initially
    });

    useEffect(() => {
        if (flashcardOptions.length > 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                flashcards: flashcardOptions[0]._id, // Set default to the first flashcard
            }));
        }
    }, [flashcardOptions]); // Runs when flashcardOptions updates
    

    const handleStatusChange = (index, newStatus) => {
        const updatedStudyList = [...studyList];
        updatedStudyList[index].status = newStatus;
        setStudyList(updatedStudyList);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/studylists/delete/${id}`); // Send the correct id to delete
            if (response.data.success) {
                setStudyList(studyList.filter(item => item._id !== id)); // Remove the item locally
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Failed to delete. Please try again later.');
        }
    };

    console.log(`studyList: ${JSON.stringify(studyList, null, 2)}`);
    console.log(`Data: ${JSON.stringify(data, null, 2)}`)   

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const dateInput = formData.date.trim();
            const dateParts = dateInput.split('/');
            if (dateParts.length !== 3 || isNaN(Date.parse(dateInput))) {
                throw new Error('Invalid date format.');
            }


            const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
            const dateTimeString = formattedDate + "T00:00:00.000Z";  // Default time set to 08:17:44.334Z
            console.log("Constructed Date-Time String:", dateTimeString);

            // Create a Date object using the constructed date-time string
            const date = new Date(dateTimeString);

            if (isNaN(date.getTime())) {
                throw new Error('Invalid Date object.');
            }
    


            const requestData = {
                date: date.toISOString(),  // Convert to ISO string with time and adjusted timezone
                subject: formData.subject,
                type: formData.type,
                FlashCard: formData.flashcards,
                userId: userId,
            };
            console.log("Data to be submitted:", JSON.stringify(requestData, null, 2));


            const response = await axios.post('http://localhost:3001/api/studylists/add', requestData, {
                withCredentials: true
            });
            console.log('Data successfully added:', response.data);

            if (response.data.success) {
                setStudyList((prevState) => [...prevState, response.data.data]);
                handleCloseModal();
                setFormData({
                    date: '',
                    subject: '',
                    type: 'Quiz',
                    flashcards: flashcardOptions[0],
                });

                fetchStudyList();
            } else {
                console.error('Error adding study data:', response.data.message);
            }

        } catch (error) {
            console.error('Error adding data:', error);
            alert('Failed to submit the form. Please try again later.');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
  
    return (
        <fieldset>
            <legend>Study List</legend>
            <button className="addbtn" onClick={handleOpenModal}>Add</button>
            {isModalOpen && (
                <>
                    <div className="backdrop" onClick={handleCloseModal}></div>
                    <dialog open data-modal className="input--study">
                        <div className="modal-content">
                            <form onSubmit={handleFormSubmit}>
                                <label>
                                    Date (mm-dd-yyyy):
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Subject:
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Type:
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        {typeOptions.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Flashcard:
                                    <select
                                        name="flashcards"
                                        value={formData.flashcards}
                                        onChange={handleInputChange}
                                    >
                                        {flashcardOptions.length > 0 ? (
                                            flashcardOptions.map((flashcard) => (
                                                <option key={flashcard._id} value={flashcard._id}>
                                                    {flashcard.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>
                                                No flashcards available
                                            </option>
                                        )}
                                    </select>
                                </label>
                                <div className="form-buttons">
                                    <button type="submit" disabled={flashcardOptions.length < 1}>
                                        {flashcardOptions.length > 0 ? 'Submit' : 'Unable to Submit'}
                                    </button>
                                    <button type="button" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Type</th>
                        <th>Flashcards</th>
                        <th>Progress</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {studyList.map((item, index) => {
                        // Find the matching flashcard from data
                        const matchedFlashcard = data.find(flashcard => flashcard._id === item.FlashCard);
    
                        // Determine the progress status based on learnedPercentage
                        const progressStatus = matchedFlashcard
                            ? parseFloat(matchedFlashcard.statistics.learnedPercentage) === 0
                                ? "Pending"
                                : parseFloat(matchedFlashcard.statistics.learnedPercentage) < 100
                                ? "On Progress"
                                : "Complete"
                            : "No Data"; // Fallback if no matching flashcard is found
    
                        return (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.subject}</td>
                                <td>{item.type}</td>
                                <td>{matchedFlashcard ? matchedFlashcard.name : "Not Found"}</td>
                                <td>
                                    {matchedFlashcard
                                        ? matchedFlashcard.statistics.learnedPercentage + "%"
                                        : "N/A"}
                                </td>
                                <td>{progressStatus}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item._id)}  // Pass the id of the item
                                    >
                                        <Icon icon="streamline:recycle-bin-2" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </fieldset>
    );
}    

export default StudyList;