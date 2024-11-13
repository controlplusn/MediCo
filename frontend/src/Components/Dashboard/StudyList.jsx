import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CircularProgressbar } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css'; 
import '../../styles/studylist.css';
import axios from 'axios';

const StudyList = () => {   
    const [data, setData] = useState([]);

    // Function to fetch data from the API
    const getData = () => {
        axios.get('http://localhost:8080/672ca9b1572b8a9dad197f4c') // Pass the correct userId in the URL
          .then(response => {
            const transformedData = response.data.data.map(item => ({
              id: item._id,
              date: new Date(item.date).toLocaleDateString(), // Convert to 'MM/DD/YYYY' format
              subject: item.subject,
              type: item.type,
              flashcards: item.FlashCard,  // Mapping 'FlashCard' to 'flashcards'
              progress: item.progress,
              status: item.status,
            }));
            setData(transformedData);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to load study list. Please try again later.');
          });
    };

    // Fetch data when the component mounts
    useEffect(() => {
        getData();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        subject: '',
        type: 'Quiz',
        flashcards: 'Flashcards',
    });

    const statusOptions = ['On Going', 'Done', 'Pending', 'Cancelled', 'Not Progress'];
    const typeOptions = ['Quiz', 'Exam', 'Activity', 'Others'];
    const flashcardOptions = ['Flashcards', 'No Flashcards'];

    const handleStatusChange = (index, newStatus) => {
        const updatedData = [...data];
        updatedData[index].status = newStatus;
        setData(updatedData);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/delete/${id}`); // Send the correct id to delete
            if (response.data.success) {
                // Optionally refetch or update the local state
                setData(data.filter(item => item.id !== id)); // Remove the item locally
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Failed to delete. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled out
        if (!formData.date || !formData.subject || !formData.type || !formData.flashcards) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        try {
            // Ensure the entered date is valid
            const dateInput = formData.date.trim();
            
            // Convert MM-DD-YYYY to YYYY-MM-DD format
            const dateParts = dateInput.split('-');
            if (dateParts.length !== 3 || isNaN(Date.parse(dateInput))) {
                throw new Error('Invalid date format.');
            }

            // Reconstruct the date in YYYY-MM-DD format
            const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;

            // Construct the date-time string in 'YYYY-MM-DDT08:17:44.334Z' format
            const dateTimeString = formattedDate + "T08:17:44.334Z";  // Default time set to 08:17:44.334Z

            // Log the constructed date-time string for debugging
            console.log("Constructed Date-Time String:", dateTimeString);

            // Create a Date object using the constructed date-time string
            const date = new Date(dateTimeString);

            // Check if the Date object is valid
            if (isNaN(date.getTime())) {
                throw new Error('Invalid Date object.');
            }

            // Log the Date object for debugging
            console.log("Date Object:", date);

            const requestData = {
                date: date.toISOString(),  // Convert to ISO string with time and adjusted timezone
                progress: 20,  // Default progress
                status: 'Pending',  // Default status
                subject: formData.subject,
                type: formData.type,
                userId: '672ca9b1572b8a9dad197f4c',  // Static userId
                FlashCard: formData.flashcards,
            };

            // Log the request data in JSON format
            console.log("Data to be submitted:", JSON.stringify(requestData, null, 2));

            // Send the POST request to the API
            const response = await axios.post('http://localhost:8080/add', requestData);
            console.log('Data successfully added:', response.data);

            // Refresh the data after adding a new item
            getData(); 

            handleCloseModal();
            setFormData({
                date: '',
                subject: '',
                type: 'Quiz',
                flashcards: 'Flashcards',
            });

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
                                Date (dd/mm/yyyy):
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
                                {flashcardOptions.map((flashcard) => (
                                    <option key={flashcard} value={flashcard}>
                                    {flashcard}
                                    </option>
                                ))}
                                </select>
                            </label>
                            <button type="submit">Submit</button>
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
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.subject}</td>
                            <td>{item.type}</td>
                            <td>{item.flashcards}</td>
                            <td>
                                <div className="circular-progress-wrapper">
                                    <CircularProgressbar 
                                        value={item.progress} 
                                        text={`${item.progress}%`} 
                                    />
                                </div>
                            </td>
                            <td>
                                <select 
                                    value={item.status} 
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDelete(item.id)}  // Pass the id of the item
                                >
                                    <Icon icon="streamline:recycle-bin-2"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </fieldset>
    );
};

export default StudyList;