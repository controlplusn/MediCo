import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/community.css';
import { Icon } from '@iconify/react';
import Sidebar from '../Dashboard/Sidebar';
import profile from '../../assets/50d429ea5c9afe0ef9cb3c96f784bea4.jpg';


export const Community = () => {
  const [threads, setThreads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    label: '',
    Content: '',
    Subject: '',
    username: username,
  });
  const [newComment, setNewComment] = useState({ body: '', commentId: null });
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
              withCredentials: true,
            });
            if (response.data.user) {
              setUserId(response.data.user._id);
            }
          } catch (err) {
            console.error('Error checking authentication:', err);
          }
        };
    
        fetchUser();
      }, []);

      useEffect(() => {
        const fetchUsername = async () => {
            if (!userId) return; // Wait for userId to be available

            try {
                const response = await axios.get(`http://localhost:3001/api/auth/get-username/${userId}`);
                if (response.data.success) {
                    setUsername(response.data.username);
                } else {
                    console.error('Failed to fetch username:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching username:', err);
            }
        };

        fetchUsername();
    }, [userId]);

  useEffect(() => {
    fetchThreads(); // Fetch threads when component mounts
  }, []);


  const fetchThreads = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/community/communities');
      const data = response.data.data;
      const formattedThreads = data.map((item) => ({
        id: item._id,
        title: item.Subject,
        username: item.username,
        time: calculateTimeAgo(item.PostedAt),
        postedAt: new Date(item.PostedAt),
        label: item.label,
        content: item.Content,
        commentId: item.commentId,
        likes: item.likes,
        likesCount: item.likes.length,
        // Use includes() to check if the username is in the likes array
        isLiked: item.likes.includes(username), 
        comments: [],
      }));
  
      // Set the threads initially
      setThreads(formattedThreads.sort((a, b) => b.postedAt - a.postedAt));
  
      // Fetch comments after setting threads
      formattedThreads.forEach((thread) => {
        fetchCommentsForThread(thread.commentId, thread.id);
      });
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchCommentsForThread = (commentId, threadId) => {
    if (!commentId) {
      console.log(`Missing commentId for thread: ${threadId}`);
      return;
    }

    axios
      .get(`http://localhost:3001/api/community/comment/${commentId}`)
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

  const handleFormSubmit = async () => {
    if (!newThread.label || !newThread.Subject || !newThread.Content) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/community/add', 
        { 
          label: newThread.label,
          Content: newThread.Content,
          Subject: newThread.Subject
        },
        { withCredentials: true } 
      )

      console.log(response);

      setIsDialogOpen(false);
        setNewThread({
          label: '',
          Content: '',
          Subject: '',
          username,
        });
        fetchThreads();
    } catch(error) {
        console.error('Error adding new thread:', error);
    }
  };

  const toggleHeart = async (postId, isLiked) => {
    try {
      if (isLiked) {
        const response = await axios.delete(
          `http://localhost:3001/api/community/deleteLike/${postId}/${username}`
        );
        console.log(response.data.message);
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === postId
              ? { ...thread, isLiked: false, likesCount: thread.likesCount - 1 }
              : thread
          )
        );
      } else {
        const response = await axios.post(
          `http://localhost:3001/api/community/addLike/${postId}/${username}`
        );
        console.log(response.data.message);
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === postId
              ? { ...thread, isLiked: true, likesCount: thread.likesCount + 1 }
              : thread
          )
        );
      }
    } catch (error) {
      console.error("Error toggling heart:", error);
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
      const response = await axios.post('http://localhost:3001/api/community/addComment', {
        body: newComment.body,
        username: username,
        commentId: newComment.commentId,
      });

      if (response.status === 201) {
        setIsCommentDialogOpen(false);
        setNewComment({ body: '', commentId: null }); 
        fetchThreads(); // Re-fetch threads to show updated comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchInput) ||
      thread.label.toLowerCase().includes(searchInput) ||
      thread.content.toLowerCase().includes(searchInput)
  );

  
  
  console.log("Threads: ", threads)
 if (loading) return <div>Loading...</div>;
  return (
    <div className="community-page-container">
      <Sidebar />

      <div className="community-body">
        <div className="community-container">
          <div className="community--header2">
          <h4>Community</h4>
          <div className="community--header">
          <img src={profile} alt="profile" />
          <h5>{username}</h5>  
          </div>
            
          </div>
          <hr className="borderline"/>  
            <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
            />
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
                  <div className="btns">
                  <button onClick={handleFormSubmit}>Add Thread</button>
                  <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                </div>
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
                  <div className="btns">
                  <button onClick={handleAddComment}>Submit Comment</button>
                  <button onClick={() => setIsCommentDialogOpen(false)}>Cancel</button>
                </div>
                </div>
              </div>
            )}

            {filteredThreads.map((thread) => (
              <div className="community--thread">
               
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
                <div className="communityheader--thread">
                  <h5>{thread.title}</h5>
                </div>
                <div className="thread--content">
                  <h6>{thread.content}</h6>
                </div>
                <div className="community--icon">
                  <button
                    className="heartBtn"
                    onClick={() => toggleHeart(thread.id,thread.isLiked)}
                  >
                    <Icon
                      icon={thread.isLiked ? "fluent-emoji-flat:heart-suit" : "fluent-mdl2:heart"}
                    />
                  </button>
                  <h6 className="heart-count">{thread.likesCount}</h6>
                  <button onClick={() => handleOpenCommentDialog(thread.commentId)}>
                    <Icon icon="meteor-icons:message-dots" />
                  </button>
                </div>

                <hr />
                <div className="community--comments">
                  {Array.isArray(thread.comments) && thread.comments.length > 0 ? (
                    thread.comments.map((comment) => (
                      <div className="community--commentsuserinfo">
                        <div className="communitycomments--userinfo">
                        <h3>{comment.username}</h3>
                        <span className="comment-time">{comment.time}</span>
                        </div>
                        <div className="community--commentscontent">
                        <p>{comment.body}</p>
                        </div>
                        </div>
                    ))
                  ) : (
                    <p></p>
                  )}
                  </div>
              </div>
            ))}
        </div>
    </div>
    </div>
  );
};

export default Community;