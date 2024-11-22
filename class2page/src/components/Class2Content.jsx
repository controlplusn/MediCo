import { useState, useEffect } from 'react';
import '../styles/class2content.css';
import { Icon } from '@iconify/react';
import axios from 'axios';

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

export const Class2Content = ({ data, username, updateClassData }) => {
  const [classData, setClassData] = useState(data[0]);
  const [activeTab, setActiveTab] = useState('discussion'); // Default active tab
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [newThread, setNewThread] = useState({
    label: '',
    subject: '',
    content: '',
  });
  const [newComment, setNewComment] = useState({ body: '', threadId: null });
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    // Optional: Add logging or additional logic here if needed
    console.log('Class data updated:', classData);
  }, [classData]);

  // Handle tab changes
  const handleTabChange = (tab) => setActiveTab(tab);

  // Handle input changes for new thread form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewThread((prevThread) => ({ ...prevThread, [name]: value }));
  };


  // Handle adding/removing likes (hearts)///////////////////////////////////////////////////////////////
  const toggleHeart = async (threadId, isOn) => {
    try {
      const threadIndex = classData.discussion.findIndex(
        (d) => d._id.toString() === threadId
      );
      if (threadIndex === -1) return;

      const thread = { ...classData.discussion[threadIndex] };

      const response = isOn
        ? await axios.delete(
            `http://localhost:3001/unlikeDiscussion/${classData._id}/${threadId}/${username}`
          )
        : await axios.post(
            `http://localhost:3001/likeDiscussion/${classData._id}/${threadId}/${username}`
          );

      if (response.status === 200) {
        // Update the thread's likes after toggling the like status
        thread.likes = isOn
          ? thread.likes.filter((user) => user !== username)
          : [...thread.likes, username];

        // Update the classData in the state to trigger a re-render
        const updatedDiscussion = [...classData.discussion];
        updatedDiscussion[threadIndex] = thread;
        const updatedClassData = { ...classData, discussion: updatedDiscussion };

        setClassData(updatedClassData);
        updateClassData(updatedClassData);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  

   {/*//////////////////////////////////v ADDING COMMENT PART v////////////////////////////////// */}

  // Handle opening the comment dialog
  const handleOpenCommentDialog = (threadId) => {
    setNewComment({ ...newComment, threadId });
  };

  // Handle comment input change
  const handleCommentChange = (e) => {
    setNewComment({ ...newComment, body: e.target.value });
  };

  // Handle comment submission
    const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.body) return;

    try {
      const response = await axios.post(
        `http://localhost:3001/addComment/${classData._id}/${newComment.threadId}`,
        {
          commentContent: newComment.body,
          author: username,
        }
      );

      if (response.status === 201) {
        const updatedClassData = { ...classData };
        const thread = updatedClassData.discussion.find(
          (d) => d._id.toString() === newComment.threadId
        );
        if (thread) {
          thread.comments.push(response.data.comment);
        }

        setNewComment({ body: '', threadId: null });
        setClassData(updatedClassData);
        updateClassData(updatedClassData);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Failed to add comment. Please try again.');
    }
  };

 {/*//////////////////////////////////^ ADDING COMMENT PART ^////////////////////////////////// */}


  {/*//////////////////////////////////v ADDING DISCUSSION PART v////////////////////////////////// */}
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/addDiscussion/${classData._id}`,
        {
          title: newThread.subject,
          author: classData.host,
          content: newThread.content,
        }
      );
  
      if (response.status === 201) {
        // Re-map the discussion array with the newly added thread
        const updatedDiscussion = [...classData.discussion, response.data.discussion];
        
        // Trigger state update with the updated discussion list
        const updatedClassData = { ...classData, discussion: updatedDiscussion };
  
        setClassData(updatedClassData);
        updateClassData(updatedClassData);
  
        // Reset the form fields and close the dialog
        setNewThread({ subject: '', content: '' });
        setIsDialogOpen(false);
        setErrorMessage(null);
      }
    } catch (error) {
      setErrorMessage('Failed to add thread. Please try again.');
      console.error('Error:', error);
    }
  };
  
  
  

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewThread({ subject: '', content: '' }); // Reset form fields when dialog is closed
  };

  {/*//////////////////////////////////^ ADDING DISCUSSION PART ^////////////////////////////////// */}

  return (
    <div className="class2-content">
      <section className="ClassCard">
        <div className="ClassCardBehind"></div>
        <div className="ClassCardAbove"></div>
        <div className="CardDetails">
          <img src="https://via.placeholder.com/50" alt="Profile" />
          <div className="subnauthor">
            <h5>{classData.title}</h5>
            <h6>By {classData.host}</h6>
          </div>
        </div>
      </section>

      <nav>
        <h5 onClick={() => handleTabChange('discussion')} className={activeTab === 'discussion' ? 'active' : ''}>
          Discussion
        </h5>
        <h5 onClick={() => handleTabChange('people')} className={activeTab === 'people' ? 'active' : ''}>
          People
        </h5>
        <h5 onClick={() => handleTabChange('classwork')} className={activeTab === 'classwork' ? 'active' : ''}>
          Classwork
        </h5>
      </nav>

      <div className="content--content">
        {/* Display content based on activeTab */}
        {activeTab === 'discussion' && (
          <div className="thread">
            <button onClick={() => setIsDialogOpen(true)}>Add a new thread</button>
          </div>
        )}

        {/* Dialog for adding a new thread */}
        {isDialogOpen && (
          <div className="dialog" onClick={() => setIsDialogOpen(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <h3>Add New Thread</h3>
              <form onSubmit={handleFormSubmit}>
                <label>Subject</label>
                <textarea
                  name="subject"
                  value={newThread.subject} 
                  onChange={handleInputChange}
                  placeholder="Enter subject"
                  required
                />

                <label>Content</label>
                <textarea
                  name="content"
                  value={newThread.content}
                  onChange={handleInputChange}
                  placeholder="Enter content"
                  required
                />
                <div className="dialog-buttons">
                  <button type="submit">Add Thread</button>
                  <button type="button" onClick={handleCloseDialog} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discussion Section */}
        {(activeTab === 'discussion' || activeTab === 'classwork') && classData.discussion.map((thread) => (
          <div key={thread._id} className="classpost">
            <div className="class-userinfo">
              <img src="https://via.placeholder.com/50" alt="User profile" />
              <div className="user-details">
                <h6>{thread.author}</h6>
                <h6>{timeAgo(thread.date)}</h6> {/* Display time difference here */}
              </div>
            </div>
            <div className="class-thread">
              <h6>{thread.title}</h6>
              <p>{thread.content}</p>
            </div>
            <div className="actions">
              <button className="heartBtn" onClick={() => toggleHeart(thread._id,thread.likes.includes(username))}>
                <Icon icon={thread.likes.includes(username) ? 'fluent-emoji-flat:heart-suit' : 'fluent-mdl2:heart'} />
              </button>
              <h6 className="heart-count">{thread.likes.length}</h6>
              
              <button className="btncomment" onClick={() => handleOpenCommentDialog(thread._id)}>
                <Icon icon="meteor-icons:message-dots" />
              </button>
            </div>

            {/* Comment section */}
            <div className="class-comments">
              {thread.comments.length > 0 ? (
                thread.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-user">
                      <img src="https://via.placeholder.com/50" alt="User" />
                      <h3>{comment.author}</h3>
                      <h6>{timeAgo(comment.time)}</h6>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        ))}

        {/* comment dialog */}
        {newComment.threadId && (
          <div className="dialog" onClick={() => setNewComment({ body: '', threadId: null })}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <h3>Add Comment</h3>
              <textarea
                value={newComment.body}
                onChange={handleCommentChange}
                placeholder="Write your comment here"
                required
              ></textarea>
              <button onClick={handleAddComment}>
                Submit Comment
              </button>
              <button onClick={() => setNewComment({ body: '', threadId: null })}>
                Cancel
              </button>
            </div>
          </div>
        )}


        {/* People Section */}
        {activeTab === 'people' && (
          <div className="people-list">
            <div className="people">
                <img src="https://via.placeholder.com/50" alt={classData.host} className='people--img'/>
                <h6>{classData.host} (host)</h6> 
              </div>
            {classData.people.map((person, index) => (
              <div key={index} className="people">
                <img src="https://via.placeholder.com/50" alt={person} className='people--img' />
                <h6>{person}</h6> {/* Display the person's name */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Class2Content;
