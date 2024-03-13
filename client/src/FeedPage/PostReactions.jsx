import React from 'react';

// Component to display reactions (in this case - emojis), comments count, and shares count for a post
const PostReactions = ({ emojisCount, commentsCount, sharesCount }) => {
  return (
    <div className="post-reactions">
      <div className="reactions">
        <div className="emojis">
          <img src='/reactions/wow.svg' alt="Wow Emoji" />
          <img src='/reactions/haha.svg' alt="Haha Emoji" />
          <img src='/reactions/like.svg' alt="Like Emoji" />
        </div>
        <span>{emojisCount}</span>
      </div>
      <div className="comment-share" >
        <div className='share-comment' >
          <span>{commentsCount}</span>
          <span>Comments</span>
        </div>
        <div className="shares share-comment">
          <span>{sharesCount}</span>
          <span>Shares</span>
        </div>
      </div>
    </div>
  );
};

export default PostReactions;
