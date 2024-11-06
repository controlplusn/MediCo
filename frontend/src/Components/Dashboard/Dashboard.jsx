import React from 'react'
import Sidebar from './Sidebar'
import Profile from './Profile'
import Content from './Content'
import '../../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
        <div className='dashboard'>
            <Sidebar />
            <div className="dashboard--content">
                <Content />
                <Profile />
        </div>
    </div>
    </div>
  )
}

export default Dashboard

