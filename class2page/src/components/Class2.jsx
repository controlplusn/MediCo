import React from 'react';
import Classheader from './Classheader.jsx';
import Class2Content from './Class2Content.jsx';

export const Class2 = ({ username, classId }) => {
 

  return (
    <div>
      <Classheader />
      <Class2Content classId={classId} username={username}/>
    </div>
  );
};

export default Class2;
