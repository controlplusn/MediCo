import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/community.css';
import { Icon } from '@iconify/react';

export const Community = ({ username }) => {
  const [threads, setThreads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    label: '',
    Content: '',
    Subject: '',
    username: username,
  });

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
        }));

        setThreads(formattedThreads.sort((a, b) => b.postedAt - a.postedAt));
      })
      .catch((error) => console.error('Error fetching data:', error));
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
    // Check if all fields are filled
    if (!newThread.label || !newThread.Subject || !newThread.Content) {
      alert('All fields must be filled');
      return;
    }

    // Proceed with submission if fields are valid
    axios
      .post('http://localhost:6969/add', newThread)
      .then((response) => {
        setIsDialogOpen(false);
        // Reset the form after successful submission
        setNewThread({
          label: '',
          Content: '',
          Subject: '',
          username,
        });
        // Fetch updated list of threads
        fetchThreads();
      })
      .catch((error) => {
        console.error('Error adding new thread:', error);
        alert('Failed to add new thread: ' + error.response.data.error);
      });
  };

  return (
    <div className="community-container">
      <div className="search-box">
        <input type="text" placeholder="Search" />
        <Icon icon="radix-icons:magnifying-glass" />
      </div>

      <div className="thread">
        <button onClick={handleAddThreadClick}>Add Thread</button>
        <Icon icon="mingcute:add-fill" style={{ backgroundColor: '#1E2022' }} />
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
            <Icon icon="fluent-mdl2:heart" />
            <Icon icon="meteor-icons:message-dots" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Community;
