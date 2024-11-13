import React from 'react';
import '../assets/styles/community.css';
import { Icon } from '@iconify/react';

export const Community = () => {
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

      {/* First Community Thread */}
      <div className="community--thread">
        <div className="communityheader--thread">
          <h5>Lecture Rescheduling</h5>
        </div>
        <div className="communityuser--thread">
          <img src="https://via.placeholder.com/30" alt="User" />
          <div className="community--userinfo">
            <h6 className="username">Lou</h6>
            <h6 className="userinfo--time">6h ago</h6>
          </div>
          <div className="community--label">
          <h6>Source</h6>
        </div>
        </div>

        <div className="thread--content">
          <h6>
            Hi medocommunity! I would love to share a webinar I found for the
            upcoming medical students. Hope this could help.
          </h6>
        </div>
        <div className="community--icon">
          <Icon icon="fluent-mdl2:heart" />
          <Icon icon="meteor-icons:message-dots" />
          <Icon icon="stash:share" />
        </div>
      </div>

      {/* Second Community Thread */}
      <div className="community--thread">
        <div className="communityheader--thread">
          <h5>Ask for Notes</h5>
        </div>
        <div className="communityuser--thread">
          <img src="https://via.placeholder.com/30" alt="User" />
          <div className="community--userinfo">
            <h6 className="username">Gian</h6>
            <h6 className="userinfo--time">12h ago</h6>
          </div>
          <div className="community--label">
          <h6>Motivation</h6>
        </div>
        </div>

        <div className="thread--content">
          <h6>
            After years of hard work, I finally made it!! #Dr.Gian #Thanks2Medico
          </h6>
          <img src="https://via.placeholder.com/500" alt="Celebration" />
        </div>
        <div className="community--icon">
          <Icon icon="fluent-mdl2:heart" />
          <Icon icon="meteor-icons:message-dots" />
          <Icon icon="stash:share" />
        </div>
      </div>
    </div>
  );
};

export default Community;
