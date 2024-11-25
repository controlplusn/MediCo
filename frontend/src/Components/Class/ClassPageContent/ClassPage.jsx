import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import '../../../styles/classpage.css';
import { useParams } from 'react-router-dom';

// Function to calculate time difference
const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now - then) / 1000);
  
    const days = Math.floor(diffInSeconds / (24 * 60 * 60));
    const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
  
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    return 'Just now';
};


const ClassPage = ({ classId, username }) => {
    // state management
    const [classData, setClassData] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newThread, setNewThread] = useState({ subject: '', content: '' });
    const [newComment, setNewComment] = useState({ body: '', threadId: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch class data
    const fetchClassData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/class/${username}/${classId}`);
            setClassData(response.data[0]);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch class data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassData();
    }, [username, classId]);

    const handleTabChange = (tab) => setActiveTab(tab);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!classData) return <div>No class data found</div>;


    return (
        <div className="class2-content">
            <section className="ClassCard">
              <div className="CardDetails">
                <img src="https://via.placeholder.com/50" alt="Profile" />
                <div className="subnauthor">
                  <h5>{classData.title}</h5>
                  <h6>By {classData.host}</h6>
                </div>
              </div>
            </section>
        
        </div>
    );
}

export default ClassPage;