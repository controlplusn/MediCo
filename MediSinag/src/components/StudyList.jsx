import React, { useState } from 'react';
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

    const statusOptions = ['On Going', 'Done', 'Pending', 'Cancelled','Not Progress'];

    const handleStatusChange = (index, newStatus) => {
        const updatedData = [...data];
        updatedData[index].status = newStatus;
        setData(updatedData);
    };

    return (
        <fieldset>
            <legend> Study List </legend>
            <button className="editbtn">Edit</button>
            <button className="addbtn">Add</button>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </fieldset>
    );
};

export default StudyList;