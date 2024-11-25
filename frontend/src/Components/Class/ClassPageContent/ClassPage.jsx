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

    // Add new comment states
    const [expandedThreads, setExpandedThreads] = useState({});

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

    // Toggle like/unlike on discussion threads
    const toggleHeart = async (threadId, isOn) => {
        try {
            const threadIndex = classData.discussion.findIndex((d) => d._id.toString() === threadId);
            if (threadIndex === -1) return;

            const thread = { ...classData.discussion[threadIndex] };
            const response = isOn
                ? await axios.delete(`http://localhost:3001/api/class/unlikeDiscussion/${classId}/${threadId}/${username}`, { withCredentials: true })
                : await axios.post(`http://localhost:3001/api/class/likeDiscussion/${classId}/${threadId}/${username}`, {}, { withCredentials: true });

            if (response.status === 200) {
                thread.likes = isOn
                    ? thread.likes.filter((user) => user !== username)
                    : [...thread.likes, username];

                const updatedDiscussion = [...classData.discussion];
                updatedDiscussion[threadIndex] = thread;
                setClassData({ ...classData, discussion: updatedDiscussion });
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Toggle comments section
    // const toggleComments = (threadId) => {
    //     setExpandedThreads(prev => ({
    //         ...prev,
    //         [threadId]: !prev[threadId]
    //     }));
    // };

    // Add new comment to a thread
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.body || !newComment.threadId) return;

        console.log("New comment id:", newComment.threadId);

        try {
            const response = await axios.post(
                `http://localhost:3001/api/class/addComment/${classId}/${newComment.threadId}`,
                { 
                    commentContent: newComment.body, 
                    author: username 
                },
                { withCredentials: true }
            );

            if (response.status === 201) {
                const updatedClassData = { ...classData };
                const thread = updatedClassData.discussion.find((d) => d._id.toString() === newComment.threadId);
                
                if (thread) {
                    thread.comments.push(response.data.comment);
                }
                
                setNewComment({ body: '', threadId: null });
                setClassData(updatedClassData);
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
            // Optionally set an error state to show to the user
        }
    };





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


            <nav>
                <h5 onClick={() => handleTabChange('discussion')} className={activeTab === 'discussion' ? 'active' : ''}>Discussion</h5>
                <h5 onClick={() => handleTabChange('people')} className={activeTab === 'people' ? 'active' : ''}>People</h5>
                <h5 onClick={() => handleTabChange('classwork')} className={activeTab === 'classwork' ? 'active' : ''}>Classwork</h5>
            </nav>
        
        </div>
    );
}

export default ClassPage;