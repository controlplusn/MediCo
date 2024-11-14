import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import axios from 'axios'; // Ensure axios is imported
import '../assets/styles/community.css';
import { Icon } from '@iconify/react';

export const Community = () => {
  // Array of community threads
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    // Fetch data from API
    axios
      .get('http://localhost:6969/')
      .then((response) => {
        const data = response.data.data; // Access data property

        // Map over the data and calculate time difference for each thread
        const formattedThreads = data.map((item) => {
          const timeAgo = calculateTimeAgo(item.PostedAt);
          return {
            id: item._id, // Use _id from the API response
            title: item.Subject,
            username: item.username,
            time: timeAgo, // Time difference from current time
            label: item.label, // Add a default label or customize as needed
            content: item.Content, // Use Content from the API response
          };
        });

        setThreads(formattedThreads);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Function to calculate time difference from the current time
  const calculateTimeAgo = (postedAt) => {
    const now = new Date();
    const postedDate = new Date(postedAt);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day(s) ago`;
    } else if (hours > 0) {
      return `${hours} hour(s) ago`;
    } else if (minutes > 0) {
      return `${minutes} minute(s) ago`;
    } else {
      return `${diffInSeconds} second(s) ago`;
    }
  };

  return (
    <div className="community-container">
      {/* Search Box */}
      <div className="search-box">
        <input type="text" placeholder="Search" />
        <Icon icon="radix-icons:magnifying-glass" />
      </div>

      {/* Thread Input */}
      <div className="thread">
        <input type="text" placeholder="Add a new thread" />
        <Icon icon="mingcute:add-fill" />
      </div>

      {/* Map over threads array */}
      {threads.map((thread) => (
        <div key={thread.id} className="community--thread">
          {/* Thread Header */}
          <div className="communityheader--thread">
            <h5>{thread.title}</h5>
          </div>

          {/* User Info and Label */}
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

          {/* Thread Content */}
          <div className="thread--content">
            <h6>{thread.content}</h6>
          </div>

          {/* Icons */}
          <div className="community--icon">
            <Icon icon="fluent-mdl2:heart" />
            <Icon icon="meteor-icons:message-dots" />
            <Icon icon="stash:share" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Community;