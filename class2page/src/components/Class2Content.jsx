import { useState } from 'react';
import '../styles/class2content.css';
import { Icon } from '@iconify/react';

export const Class2Content = () => {
  const [activeTab, setActiveTab] = useState('discussion'); // Default active tab
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [newThread, setNewThread] = useState({
    label: '',
    subject: '',
    content: '',
  }); 

  const [threads, setThreads] = useState([
    {
      id: 1,
      content: 'Understanding the human body.',
      username: 'Doc_Iorem123',
      time: '2 hours ago',
      heartCount: 5,
      isLiked: false,
      commentCount: 0,
      comments: [
        {
          id: 1,
          username: 'JohnDoe',
          body: 'This is a very interesting topic!',
          time: '1 hour ago',
        },
      ],
    },
    {
      id: 2,
      content: 'A detailed explanation of the periodic table.',
      username: 'ChemistryGuru',
      time: '1 day ago',
      heartCount: 3,
      isLiked: false,
      commentCount: 2,
      comments: [],
    },
  ]);

  const [newComment, setNewComment] = useState({ body: '', threadId: null });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewThread((prevThread) => ({
      ...prevThread,
      [name]: value,
    }));
  };

  const handleAddThreadClick = () => {
    setIsDialogOpen(true); // Open the dialog
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setThreads([
      ...threads,
      { ...newThread, id: threads.length + 1, heartCount: 0, commentCount: 0, comments: [] },
    ]);
    setNewThread({ content: '' });
    setIsDialogOpen(false); // Close the dialog after form submission
  };

  const toggleHeart = (threadId) => {
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? {
            ...thread,
            isLiked: !thread.isLiked,
            heartCount: thread.isLiked ? thread.heartCount - 1 : thread.heartCount + 1,
          }
        : thread
    ));
  };

  const handleOpenCommentDialog = (threadId) => {
    setNewComment({ ...newComment, threadId });
  };

  const handleCommentChange = (e) => {
    setNewComment({ ...newComment, body: e.target.value });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.body) return;

    const updatedThreads = threads.map((thread) =>
      thread.id === newComment.threadId
        ? {
            ...thread,
            comments: [
              ...thread.comments,
              {
                id: thread.comments.length + 1,
                username: 'CurrentUser',
                body: newComment.body,
                time: 'Just now', 
              },
            ],
            commentCount: thread.commentCount + 1,
          }
        : thread
    );
    setThreads(updatedThreads);
    setNewComment({ body: '', threadId: null });
  };

  return (
    <div className="class2-content">
      <section className="ClassCard">
        <div className="ClassCardBehind"></div>
        <div className="ClassCardAbove"></div>
        <div className="CardDetails">
          <img src="https://via.placeholder.com/50" alt="Profile" />
          <div className="subnauthor">
            <h5>Anatomy</h5>
            <h6>By Doc_Iorem123</h6>
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
        <div className="thread">
          <button onClick={handleAddThreadClick}>Add a new thread</button>
        </div>

        {/* Dialog for adding a new thread */}
        {isDialogOpen && (
          <div className="dialog" onClick={() => setIsDialogOpen(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <h3>Add New Thread</h3>
              <form onSubmit={handleFormSubmit}>
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
                  <button type="button" onClick={() => setIsDialogOpen(false)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Thread list */}
        {threads.map((thread) => (
          <div key={thread.id} className="classpost">
            <div className="class-userinfo">
              <img src="https://via.placeholder.com/50" alt="User profile" />
              <div className="user-details">
                <h6>{thread.username}</h6>
                <h6>{thread.time}</h6>
              </div>
            </div>
            <div className="class-thread">
              <h6>{thread.subject}</h6>
              <p>{thread.content}</p>
            </div>
            <div className="actions">
              <button className="heartBtn" onClick={() => toggleHeart(thread.id)}>
                <Icon icon={thread.isLiked ? 'fluent-emoji-flat:heart-suit' : 'fluent-mdl2:heart'} />
              </button>
              <h6 className="heart-count">{thread.heartCount}</h6>
              
              <button className="btncomment" onClick={() => handleOpenCommentDialog(thread.id)}>
                <Icon icon="meteor-icons:message-dots" />
              </button>
              
            </div>

            {/* Comment section */}
            <div className="class-comments">
              {thread.comments.length > 0 ? (
                thread.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-user">
                      <img src="https://via.placeholder.com/50" alt="User" />
                      <h3>{comment.username}</h3>
                      <h6>{comment.time}</h6>
                    </div>
                    <p>{comment.body}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            {/* Comment dialog for adding a comment */}
            {newComment.threadId === thread.id && (
              <div className="dialog" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-content">
                  <h3>Add Comment</h3>
                  <textarea
                    value={newComment.body}
                    onChange={handleCommentChange}
                    placeholder="Write your comment here"
                    required
                  ></textarea>
                  <button onClick={handleAddComment}>Submit Comment</button>
                  <button onClick={() => setNewComment({ body: '', threadId: null })}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Class2Content;
