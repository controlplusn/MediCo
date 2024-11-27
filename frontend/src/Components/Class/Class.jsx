import React, { useState, useEffect } from 'react'
import ClassHeader from './ClassHeader';
import ClassContent  from './ClassContent';
import '../../styles/class.css';
import Sidebar from '../Dashboard/Sidebar';

const Class = () => {
  return (
    <div className="class-page-container">
      <Sidebar />

      <div className="class-container">
        <ClassHeader />
        <ClassContent />
      </div>
    </div>
  )
}

export default Class;