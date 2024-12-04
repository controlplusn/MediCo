import React from 'react'
import '../../../styles/classpageheader.css'
import {Icon} from '@iconify/react'
import { Link } from 'react-router-dom'

export const ClassPageHeader = () => {
  return (
    <div className="headerclass">
      <Link to="/class">
        <Icon icon="weui:back-outlined"/>
      </Link>
        <h5>Class</h5>
    </div>
            

  )
}

export default ClassPageHeader;