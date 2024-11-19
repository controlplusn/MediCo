import React from 'react'
import {Icon} from '@iconify/react'

export const FlearnContent = () => {
  return (
    <div className="flearn--content--container">
        <h5>Anatomy</h5>
        <label>
        <div className="tagname">
          <h6>Chapter 1</h6>
          </div>
          <div className="tagname">
          <h6>Central Ne...</h6>
          </div>
        </label>

        <progress value={50} max={100}/>
        <div className="qna--container">
            <h6>The Central Nervous System (CNS) is a major part of the body's nervous system responsible for processing and coordinating sensory information, controlling motor functions, and regulating cognitive activities such as thinking and memory.</h6>
        </div>
        <hr className="borderline"/>
        <div className="prevnnext">
            <Icon icon = "ep:arrow-left"/>
            <h5>Central Nervous System</h5>
            <Icon icon="ep:arrow-right"/>
        </div>
    </div>
  )
}

export default FlearnContent;