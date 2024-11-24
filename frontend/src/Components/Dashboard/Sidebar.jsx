import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../styles/sidebar.css'

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    return (
        <div className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="logo" onClick={toggleSidebar}>
                <img src={logo} alt="image-icon" />
                <p className='logoName'>MediCo</p>
                <div className="menu-icon">
                    <Icon icon="icon-park-outline:hamburger-button" />
                </div>
            </div>

            <div className={`sidenavbar ${isCollapsed ? 'collapsed' : ''}`}>
                <Link to="/dashboard">
                    <ul
                        className={`item ${activeItem === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleItemClick('dashboard')}
                    >
                        <Icon icon="mage:dashboard-fill" />
                        {!isCollapsed && 'Dashboard'}
                    </ul>
                </Link>

                <Link to="/flashcards">
                    <ul
                        className={`item ${activeItem === 'flashcards' ? 'active' : ''}`}
                        onClick={() => handleItemClick('flashcards')}
                    >
                        <Icon icon="ph:cards-fill" />
                        {!isCollapsed && 'Flash Cards'}
                    </ul>
                </Link>
                <ul
                    className={`item ${activeItem === 'notes' ? 'active' : ''}`}
                    onClick={() => handleItemClick('notes')}
                >
                    <Icon icon="oui:index-edit" />
                    {!isCollapsed && 'Notes'}
                </ul>
                <ul
                    className={`item ${activeItem === 'graphs' ? 'active' : ''}`}
                    onClick={() => handleItemClick('graphs')}
                >
                    <Icon icon="game-icons:anatomy" />
                    {!isCollapsed && 'Graphs'}
                </ul>

                <Link to="/community">
                    <ul
                        className={`item ${activeItem === 'community' ? 'active' : ''}`}
                        onClick={() => handleItemClick('community')}
                    >
                        <Icon icon="fluent:people-community-24-filled" />
                        {!isCollapsed && 'Community'}
                    </ul>
                </Link>
                
                <Link to="/class">
                    <ul
                        className={`item ${activeItem === 'class' ? 'active' : ''}`}
                        onClick={() => handleItemClick('class')}
                    >
                        <Icon icon="streamline:class-lesson-solid" />
                        {!isCollapsed && 'Class'}
                    </ul>
                </Link>
            </div>

            <div className="user--sidebar">
            <img src="https://via.placeholder.com/50" alt="User" />
            <h6>John Doe</h6>
            </div>
        </div>
    );
};

export default Sidebar;