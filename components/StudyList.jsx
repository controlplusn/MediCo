import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import '../assets/styles/studylist.css'

const StudyList = () => {
    return (
    <fieldset>
        <legend>Study List</legend>
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
                <tr>
                    <td>10/14/2024</td>
                    <td>Human Anatomy</td>
                    <td>Exam</td>
                    <td>Flashcards</td>
                    <td><Icon icon = "raphael:piechart"/></td>
                    <td>On Going</td>
                </tr>
                <tr>
                    <td>10/14/2024</td>
                    <td>Biochemistry</td>
                    <td>Quiz</td>
                    <td>Flashcards</td>
                    <td><Icon icon = "raphael:piechart"/></td>
                    <td>Done</td>
                </tr>
                <tr>
                    <td>10/14/2024</td>
                    <td>Histology</td>
                    <td>Activities</td>
                    <td>Flashcards</td>
                    <td><Icon icon = "raphael:piechart"/></td>
                    <td>Done</td>
                </tr>
                <tr>
                    <td>10/14/2024</td>
                    <td>Physiology</td>
                    <td>Quiz</td>
                    <td>Flashcards</td>
                    <td><Icon icon = "raphael:piechart"/></td>
                    <td>On Going</td>
                </tr>
            </tbody>
        </table>
    </fieldset>
    );

};

export default StudyList;