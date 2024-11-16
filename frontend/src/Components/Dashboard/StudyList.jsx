import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CircularProgressbar } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css'; 
import '../../styles/studylist.css';
import axios from 'axios';

const StudyList = () => {   
    const [studyList, setStudyList] = useState([]); 
    const [userId, setUserId] = useState(null); // Store user id once user is authenticated

    // fetch userId
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
                    withCredentials: true,
                });
                console.log(response);

                if (response.data.user) {
                    setUserId(response.data.user._id);
                }

            } catch (error) {
                console.error('Error checking authentication', error);
            }
        };

        fetchUser();
    }, []);

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
            const dateInput = formData.date.trim();
            const dateParts = dateInput.split('-');
            if (dateParts.length !== 3 || isNaN(Date.parse(dateInput))) {
                throw new Error('Invalid date format.');
            }


            const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
            const dateTimeString = formattedDate + "T08:17:44.334Z";  // Default time set to 08:17:44.334Z
            console.log("Constructed Date-Time String:", dateTimeString);

            // Create a Date object using the constructed date-time string
            const date = new Date(dateTimeString);

            if (isNaN(date.getTime())) {
                throw new Error('Invalid Date object.');
            }
            console.log("Date Object:", date);


            const requestData = {
                date: date.toISOString(),  // Convert to ISO string with time and adjusted timezone
                progress: 20,  // Default progress
                status: 'Pending',  // Default status
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
                    flashcards: 'Flashcards',
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
                    {studyList.map((item, index) => (
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
                                    onClick={() => handleDelete(item._id)}  // Pass the id of the item
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