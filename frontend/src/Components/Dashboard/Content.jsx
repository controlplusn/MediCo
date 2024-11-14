import React from 'react';
import ContentHeader from './ContentHeader';
import Greetings from './Greetings';
import Card from './Card';
// import StudyList from './StudyList';
import '../../styles/content.css';

const Content = () => {
    return (
    <div className="content">
        <ContentHeader />
        <Greetings />
        <Card />
        {/* <StudyList /> */}
    </div>
    );
};

export default Content;