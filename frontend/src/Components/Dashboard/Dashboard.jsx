import React from 'react'
import Sidebar from './Sidebar'
import Profile from './Profile'
import Content from './Content'

const Dashboard = () => {
  return (
    <div>
        <Sidebar />
        <Content />
        <Profile />
    </div>
  )
}

export default Dashboard