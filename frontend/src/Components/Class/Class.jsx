import React, { useState, useEffect } from 'react'
import ClassHeader from './ClassHeader';
import ClassContent  from './ClassContent';
import '../../styles/class.css';

const Class = () => {
  return (
    <div className="class-container">
        <ClassHeader />
        <ClassContent />
    </div>
  )
}

export default Class;