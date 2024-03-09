import React from "react";
import PostReactions from "./PostReactions";
import PostActions from "./PostActions";
import { useNavigate } from "react-router-dom";

// Component representing a single post
const Post = ({ authorImageSrc, authorName, userId, timeStamp, postBody, postImageSrc, label, postTitle, postDescription, emojisCount, commentsCount, sharesCount, isLiked, isCommented, onLike, comments, onComment, onShare }) => {
    const navigate = useNavigate();

    const handleAuthorClick = async () => {
        try {
            const id = userId._id;
            navigate(`/user/${id}`);
        } catch (err) {
            if (err.status) {
                alert(err.message);
                return;
            }
            console.log(err);
        }
    };

    return (
        <div className="card post">
            <div className="post-header">
                <div className="post-author-info">
                    <img src={authorImageSrc} alt="Author" />
                    <div>
                        <div>
                            <span className="author-name" onClick={handleAuthorClick}>
                                {authorName}
                            </span>
                        </div>
                        <div className="details">
                            <span>{timeStamp}</span>
                        </div>
                    </div>
                </div>
                <i className="post-menu-icon"></i>
            </div>
            <p className="post-body">{postBody}</p>
            <a className="post-image" href="#">
                <img src={postImageSrc} alt="Post" />
            </a>

            <PostReactions emojisCount={emojisCount} commentsCount={commentsCount} sharesCount={sharesCount} />
            <div className="comments-section">
                <p>{isCommented && "displaying only relevant comments"}</p>
                <ul className="comments-list">
                    {comments?.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                </ul>
            </div>
            <PostActions onLike={onLike} onComment={(newComment) => onComment(newComment)} onShare={onShare} isLiked={isLiked} iscommented={isCommented} commentsCount={commentsCount} sharesCount={sharesCount} />
        </div>
    );
};

export default Post;
