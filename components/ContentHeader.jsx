import React from 'react';
import {Icon} from '@iconify/react';


const ContentHeader = () => {
    return (
    <div className="content--header">
        <h2 className="header--title">Dashboard</h2>
            <div className="header--activity">
                <div className="searchbox">
                    <Icon icon = "quill:hamburger"/>
                    <input type="text" placeholder="Search"/>
                    <Icon icon = "radix-icons:magnifying-glass"/>
                </div>
            </div>
    </div>
    );
};

export default ContentHeader;