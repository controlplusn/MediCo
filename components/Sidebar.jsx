import React from 'react';
import {Icon} from '@iconify/react';
import '../assets/styles/Sidebar.css'


const Sidebar = () => {
    return(
        <div className="menu">
            <div className="logo">
            <img src="https://via.placeholder.com/50" alt="image-icon"/>
            </div>

            <li className="sidenavbar">
                <ul className="item">
                <Icon icon ="mage:dashboard-fill"/>
                Dashboard
                </ul>
                <ul className="item">
                <Icon icon ="ph:cards-fill"/>
                Flash Cards
                </ul>
                <ul className="item">
                <Icon icon ="fluent:quiz-new-20-filled"/>
                Quiz
                </ul>
                <ul className="item">
                <Icon icon ="oui:index-edit"/>
                Notes
                </ul>
                <ul className="item">
                <Icon icon ="game-icons:anatomy"/>
                Graphs
                </ul>
                <ul className="item">
                <Icon icon ="fluent:people-community-24-filled"/>
                Community
                </ul>
                <ul className="item">
                <Icon icon ="streamline:class-lesson-solid"/>
                Class
                </ul>
            </li>
        </div>
    ) 
};

export default Sidebar;