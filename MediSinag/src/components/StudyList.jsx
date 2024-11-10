import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css'; 
import { Icon } from '@iconify/react';
import '../assets/styles/studylist.css';

const StudyList = () => {
    const data = [
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
    ];

    return (
        <fieldset>
            <legend> Study List </legend>
            <button>Edit</button>
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
                            <td>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </fieldset>
    );
};

export default StudyList;
