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
        console.log("Username on class page:", username);
        console.log("Class id on class page:", classId);

        try {
            const response = await axios.get(`http://localhost:3001/api/class/${username}/${classId}`, {
                withCredentials: true
            });

            setClassData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching class data:', err.response ? err.response.data : err.message);
            setError('Failed to fetch class data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassData();
    }, [username, classId]);

    const handleTabChange = (tab) => setActiveTab(tab);

    // Toggle like/unlike on discussion threads
    const toggleHeart = async (threadId, isCurrentlyLiked) => {
        try {   
            console.log('ToggleHeart called with:', { threadId, isCurrentlyLiked });
            const threadIndex = classData.discussions.findIndex((d) => d._id === threadId);
            if (threadIndex === -1) {
                console.log('Thread not found');
                return;
            }

            const thread = classData.discussions[threadIndex];
    
            const response = isCurrentlyLiked
                ? await axios.delete(`http://localhost:3001/api/class/unlikeDiscussion/${classId}/${threadId}/${username}`, { withCredentials: true })
                : await axios.post(`http://localhost:3001/api/class/likeDiscussion/${classId}/${threadId}/${username}`, {}, { withCredentials: true });

            if (response.status === 200) {
                setClassData(prevData => {
                    const updatedDiscussions = [...prevData.discussions];
                    updatedDiscussions[threadIndex] = {
                        ...updatedDiscussions[threadIndex],
                        likes: response.data.likesCount,
                        isLikedByUser: !isCurrentlyLiked
                    };
                    console.log('Updated thread:', updatedDiscussions[threadIndex]);
                    return {
                        ...prevData,
                        discussions: updatedDiscussions
                    };
                });
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

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

    // Add a new discussionn thread
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Validate input
        if (!newThread.subject.trim() || !newThread.content.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3001/api/class/addDiscussion/${classId}`, 
                {
                    title: newThread.subject,
                    author: username,
                    content: newThread.content,
                },
                { withCredentials: true }
            );

            if (response.status === 201) {
                // Update local state with new discussion
                setClassData(prevData => ({
                    ...prevData,
                    discussions: [...prevData.discussions, response.data.discussion]
                }));
                
                // Reset form and close dialog
                setNewThread({ subject: '', content: '' });
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error('Failed to add thread:', error);
            alert('Failed to add thread. Please try again.');
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
            
            <div className="content--content">
                {activeTab === 'discussion' && (
                  <div className="thread">
                    <button onClick={() => setIsDialogOpen(true)}>Add a new thread</button>
                  </div>
                )}

                {isDialogOpen && (
                  <div className="dialog" onClick={() => setIsDialogOpen(false)}>
                    <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                      <h3>Add New Thread</h3>
                      <form onSubmit={handleFormSubmit}>
                        <label>Subject</label>
                        <textarea name="subject" value={newThread.subject} onChange={(e) => setNewThread({ ...newThread, subject: e.target.value })} required />
                        <label>Content</label>
                        <textarea name="content" value={newThread.content} onChange={(e) => setNewThread({ ...newThread, content: e.target.value })} required />
                        <div className="dialog-buttons">
                          <button type="submit">Add Thread</button>
                          <button type="button" onClick={() => setIsDialogOpen(false)} className="cancel-button">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                    classData.discussions && classData.discussions.length > 0 ? (
                        classData.discussions.map((thread) => (
                            <div key={thread._id} className="classpost">
                                <div className="class-userinfo">
                                    <img src="https://via.placeholder.com/50" alt="User profile" />
                                    <div className="user-details">
                                        <h6>{thread.author}</h6>
                                        <h6>{timeAgo(thread.date)}</h6>
                                    </div>
                                </div>
                                <div className="class-thread">
                                    <h6>{thread.title}</h6>
                                    <p>{thread.content}</p>
                                </div>
                                <div className="actions">

                                    <button 
                                        className="heartBtn" 
                                        onClick={() => toggleHeart(thread._id, thread.isLikedByUser)}
                                    >
                                        <Icon icon={thread.isLikedByUser ? 'fluent-emoji-flat:heart-suit' : 'fluent-mdl2:heart'} />
                                    </button>
                                    <h6 className="heart-count">{thread.likes}</h6>

                                    <button className="btncomment" onClick={() => setNewComment({ threadId: thread.DiscussionId, body: '' })}>
                                      <Icon icon="meteor-icons:message-dots" />
                                    </button>

                                </div>
                        
                                {thread.comments && thread.comments.length > 0 && (
                                    <div className="class-comments">
                                        {thread.comments.map((comment) => (
                                            <div key={comment._id} className="comment">
                                                <h3>{comment.author}</h3>
                                                <p>{comment.content}</p>
                                                <h6>{timeAgo(comment.date)}</h6>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>No discussions found</div>
                    )
                )}

            </div>
        </div>
    );
}

export default ClassPage;