import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/community.css';
import { Icon } from '@iconify/react';

export const Community = ({ username }) => {
  const [threads, setThreads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    label: '',
    Content: '',
    Subject: '',
    username: username,
  });
  const [newComment, setNewComment] = useState({ body: '', commentId: null });
  
  useEffect(() => {
    fetchThreads(); // Fetch threads when component mounts
  }, []);

  const fetchThreads = () => {
    axios
      .get('http://localhost:6969/')
      .then((response) => {
        const data = response.data.data;
        const formattedThreads = data.map((item) => ({
          id: item._id,
          title: item.Subject,
          username: item.username,
          time: calculateTimeAgo(item.PostedAt),
          postedAt: new Date(item.PostedAt),
          label: item.label,
          content: item.Content,
          heartId: item.heartId,
          commentId: item.commentId,
          heartCount: 0, // Initialize heart count
          isLiked: false, // Track if current user has liked the post
          comments: [] // Placeholder for thread comments
        }));

        setThreads(formattedThreads.sort((a, b) => b.postedAt - a.postedAt));
        // Fetch heart counts and user likes for each thread
        formattedThreads.forEach((thread) => {
          fetchHeartCount(thread.heartId);
          checkIfUserLiked(thread.heartId, username);
          fetchCommentsForThread(thread.commentId, thread.id); // Fetch comments for each thread
        });
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const fetchCommentsForThread = (commentId, threadId) => {
    axios
      .get(`http://localhost:6969/comment/${commentId}`)
      .then((response) => {
        const comments = response.data.data.map((item) => ({
          id: item.commentId,
          body: item.body,
          username: item.username,
          time: calculateTimeAgo(item.time),
        }));

        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === threadId ? { ...thread, comments } : thread
          )
        );
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const fetchHeartCount = (heartId) => {
    axios
      .get(`http://localhost:6969/load-heart/${heartId}`)
      .then((response) => {
        const heartCount = response.data.data.length;
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.heartId === heartId ? { ...thread, heartCount } : thread
          )
        );
      })
      .catch((error) => console.error('Error fetching heart count:', error));
  };

  const checkIfUserLiked = (heartId, username) => {
    axios
      .get(`http://localhost:6969/isHeart/${heartId}/${username}`)
      .then((response) => {
        const userLiked = response.data.data.length > 0;
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.heartId === heartId ? { ...thread, isLiked: userLiked } : thread
          )
        );
      })
      .catch((error) => console.error('Error checking if user liked:', error));
  };

  const calculateTimeAgo = (postedAt) => {
    const now = new Date();
    const postedDate = new Date(postedAt);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${diffInSeconds} second(s) ago`;
  };

  const handleAddThreadClick = () => {
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewThread((prevThread) => ({
      ...prevThread,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    if (!newThread.label || !newThread.Subject || !newThread.Content) {
      alert('All fields must be filled');
      return;
    }

    axios
      .post('http://localhost:6969/add', newThread)
      .then(() => {
        setIsDialogOpen(false);
        setNewThread({
          label: '',
          Content: '',
          Subject: '',
          username,
        });
        fetchThreads();
      })
      .catch((error) => {
        console.error('Error adding new thread:', error);
        alert('Failed to add new thread: ' + error.response.data.error);
      });
  };

  const toggleHeart = (heartId, isLiked) => {
    if (isLiked) {
      axios
        .delete(`http://localhost:6969/deleteHeart/${heartId}/${username}`)
        .then(() => {
          setThreads((prevThreads) =>
            prevThreads.map((thread) =>
              thread.heartId === heartId
                ? { ...thread, isLiked: false, heartCount: thread.heartCount - 1 }
                : thread
            )
          );
        })
        .catch((error) => {
          console.error('Error removing heart:', error);
        });
    } else {
      axios
        .post('http://localhost:6969/addHeart', {
          heartId,
          username,
        })
        .then(() => {
          setThreads((prevThreads) =>
            prevThreads.map((thread) =>
              thread.heartId === heartId
                ? { ...thread, isLiked: true, heartCount: thread.heartCount + 1 }
                : thread
            )
          );
        })
        .catch((error) => {
          console.error('Error adding heart:', error);
        });
    }
  };

  const handleOpenCommentDialog = (commentId) => {
    setNewComment({ ...newComment, commentId });
    setIsCommentDialogOpen(true);
  };

  const handleCommentChange = (e) => {
    setNewComment({ ...newComment, body: e.target.value });
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post('http://localhost:6969/addComment', {
        body: newComment.body,
        username: username,
        commentId: newComment.commentId,
      });

      if (response.status === 201) {
        alert('Comment added successfully!');
        setIsCommentDialogOpen(false);
        setNewComment({ body: '', commentId: null }); 
        fetchThreads(); // Re-fetch threads to show updated comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className="community-container">
      <div className="community--header">
      <img src="https://via.placeholder.com/50" alt="profile"></img> 
      <h5>John Doe</h5>       
    </div>
    <hr className="borderline"/>
      <div className="search-box">
        <input type="text" placeholder="Search" />
        <Icon icon="radix-icons:magnifying-glass" />
      </div>

      <div className="thread">
        <button onClick={handleAddThreadClick}>Add Thread</button>
      </div>

      {isDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <h3>Add New Thread</h3>
            <label>Label</label>
            <input
              type="text"
              name="label"
              value={newThread.label}
              onChange={handleInputChange}
              placeholder="Enter label (e.g., Chemistry)"
              required
            />
            <label>Subject</label>
            <input
              type="text"
              name="Subject"
              value={newThread.Subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              required
            />
            <label>Content</label>
            <textarea
              name="Content"
              value={newThread.Content}
              onChange={handleInputChange}
              placeholder="Enter content"
              required
            />
            <button onClick={handleFormSubmit}>Add Thread</button>
            <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isCommentDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <h3>Add Comment</h3>
            <textarea
              value={newComment.body}
              onChange={handleCommentChange}
              placeholder="Write your comment here"
              required
            ></textarea>
            <button onClick={handleAddComment}>Submit Comment</button>
            <button onClick={() => setIsCommentDialogOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {threads.map((thread) => (
        <div key={thread.id} className="community--thread">
          <div className="communityheader--thread">
            <h5>{thread.title}</h5>
          </div>
          <div className="communityuser--thread">
            <img src={"https://via.placeholder.com/30"} alt="User " />
            <div className="community--userinfo">
              <h6 className="username">{thread.username}</h6>
              <h6 className="userinfo--time">{thread.time}</h6>
            </div>
            <div className="community--label">
              <h6>{thread.label}</h6>
            </div>
          </div>
          <div className="thread--content">
            <h6>{thread.content}</h6>
          </div>
          <div className="community--icon">
  <button
    className="heartBtn"
    onClick={() => toggleHeart(thread.heartId, thread.isLiked)}
  >
    <Icon
      icon={thread.isLiked ? "fluent-emoji-flat:heart-suit" : "fluent-mdl2:heart"}
    />
  </button>
  <h6 className="heart-count">{thread.heartCount}</h6>
  <button onClick={() => handleOpenCommentDialog(thread.commentId)}>
    <Icon icon="meteor-icons:message-dots" />
  </button>
</div>
          <hr />
          <div className="community--comments">
            {thread.comments.length > 0 ? (
              thread.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <h3>{comment.username}</h3>
                  <p>{comment.body}</p>
                  <span className="comment-time">{comment.time}</span>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Community;
