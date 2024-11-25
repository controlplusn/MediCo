import React from 'react';
import ClassPageHeader from './ClassPageHeader';
// import Class2Content from './Class2Content.jsx';

export const ClassPageContent = ({ username, classId }) => {
 

  return (
    <div>
      <ClassPageHeader />
      {/* <Class2Content classId={classId} username={username}/> */}
    </div>
  );
};

export default ClassPageContent;