import React from 'react';
import '../assets/styles/community.css';
import { Icon } from '@iconify/react';

export const Community = () => {
  // Array of community threads
  const threads = [
    {
      id: 1,
      title: 'Lecture Rescheduling',
      username: 'Lou',
      time: '6h ago',
      label: 'Source',
      content: 'Hi medocommunity! I would love to share a webinar I found for the upcoming medical students. Hope this could help.',
      image: 'https://via.placeholder.com/30',
      postImage: null,
    },
    {
      id: 2,
      title: 'Ask for Notes',
      username: 'Gian',
      time: '12h ago',
      label: 'Motivation',
      content: 'After years of hard work, I finally made it!! #Dr.Gian #Thanks2Medico',
      image: 'https://via.placeholder.com/30',
      postImage: 'https://via.placeholder.com/500',
    },
  ];

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
            <img src={thread.image} alt="User" />
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
            {thread.postImage && <img src={thread.postImage} alt="Post Content" />}
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
