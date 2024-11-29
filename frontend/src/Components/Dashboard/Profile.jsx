import User from './User';
import Calendar from 'react-calendar';
import '../../styles/profile.css';
import ToDoList from './ToDoList';

const Profile = () => {
    return <div className="profile"> 
        <User />
        <Calendar  locale="en-US" />
        <ToDoList />
    </div>;

};

export default Profile;