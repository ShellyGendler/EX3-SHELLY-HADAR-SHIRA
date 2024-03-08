import React, { useState } from 'react';

// Component for handling post actions like like, comment, and share
const PostActions = ({ onLike, onComment, onShare, isLiked, commentsCount, sharesCount }) => {
// State for managing comment input field and visibility
  const [isCommenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');

  // handle like 
  const handleLikeClick = () => {
    onLike();
  };

  // handle comment
  const handleCommentClick = () => {
    if (typeof onComment === 'function') {
      onComment(newComment);
      setNewComment('');
    }
    setCommenting(false);
  };
  // handle share
  const handleShareClick = () => {
    onShare();
  };

  return (
    <div>
    <div className="post-actions">
      <div className="actions">
        <div className={"action"} onClick={handleLikeClick}>
          <img height="24px" width="24px" src={`../actions/${!isLiked?"like":"liked"}.svg`}/> 
          <span>Like{isLiked&&"d"}</span>
        </div>
        <div className="action" onClick={() => setCommenting(!isCommenting)}>
          <img height="24px" width="24px" src='../actions/comment.svg'/> 
          <span>Comment</span>
        </div>
        <div className="action" onClick={handleShareClick}>
          <i className="share-icon"></i>
          <span>Share</span>
        </div>
      </div>

      </div>
      {isCommenting && (
        <div className="comment-box">
          <textarea
          className='comment-area'
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentClick}>Post</button>
        </div>
      )}
    </div>
  );
};

export default PostActions;
