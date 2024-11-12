import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CircularProgressbar } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css'; 
import '../assets/styles/studylist.css';

const StudyList = () => {   
    const [data, setData] = useState([
        {
            date: '10/14/2024',
            subject: 'Human Anatomy',
            type: 'Exam',
            flashcards: 'Flashcards',
            progress: 66, 
            status: 'On Going',
        },
        {
            date: '10/14/2024',
            subject: 'Biochemistry',
            type: 'Quiz',
            flashcards: 'Flashcards',
            progress: 100, 
            status: 'Done',
        },
        {
            date: '10/14/2024',
            subject: 'Histology',
            type: 'Activities',
            flashcards: 'Flashcards',
            progress: 100, 
            status: 'Done',
        },
        {
            date: '10/14/2024',
            subject: 'Physiology',
            type: 'Quiz',
            flashcards: 'Flashcards',
            progress: 40, 
            status: 'On Going',
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        subject: '',
        type: 'Quiz',
        flashcards: 'Flashcards',
    });

    const statusOptions = ['On Going', 'Done', 'Pending', 'Cancelled', 'Not Progress'];

    const handleStatusChange = (index, newStatus) => {
        const updatedData = [...data];
        updatedData[index].status = newStatus;
        setData(updatedData);
    };

    const typeOptions = ['Quiz', 'Exam', 'Activity', 'Others'];
    const flashcardOptions = ['Flashcards', 'No Flashcards'];
    const handleDelete = (index) => {
        const updatedData = data.filter((_, i) => i !== index); // Remove the item from the list
        setData(updatedData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setData([...data, formData]);
        setFormData({ date: '', subject: '', type: 'Quiz', flashcards: 'Flashcards' });
        handleCloseModal();
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
                                <button type="submit">Add</button>
                                <button data-close-modal onClick={handleCloseModal}>Close</button>
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
                                    onClick={() => handleDelete(index)} 
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
