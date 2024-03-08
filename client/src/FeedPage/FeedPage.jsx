import React, { useState, useEffect } from "react";
import Post from "./Post.jsx";
import "./styles.css";

const FeedPage = () => {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Effect to apply dark mode styles
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Function to handle liking a post
  const handleLike = (index) => {
    const updatedPosts = [...posts];
    const post = updatedPosts[index];
    
    if (post.isLiked) {
      post.emojisCount -= 1;
    } else {
      post.emojisCount += 1;
    }
    post.isLiked = !post.isLiked;
  
    setPosts(updatedPosts);
  };

  // Function to handle sharing a post
  const handleShare = (index) => {
    const sharedPost = { ...posts[index], authorName: "Shared by You" };
    setPosts([sharedPost, ...posts]);
  };

  // Function to handle commenting on a post
  const handleComment = (index, comment) => {
    const updatedPosts = [...posts];
    updatedPosts[index].commentsCount += 1;
    updatedPosts[index].comments ? updatedPosts[index].comments.push(comment) : updatedPosts[index].comments = [comment] ;
    updatedPosts[index].isCommented = true;
    setPosts(updatedPosts);
  };

  // Fetching initial posts from localStorage or a JSON file
  const initialPosts = JSON.parse(localStorage.getItem("posts")) || require("./posts.json");

  // State for posts
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div>
      <div className="content-grid">
        {/* Dark mode toggle button */}
        <div className="dark-mode-toggle" onClick={toggleDarkMode}>
          <i className="toggle-icon"></i>
          <span style={{ color: `${darkMode ? "#FFF" : "#000"}` }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </div>
        <div className="column-left desktop-tablet-only"></div>
        <div className="column-center">
          <div className="content-area">
            {/* Rendering posts */}
            {posts.map((post, index) => (
              <Post
                key={index}
                authorImageSrc={post.authorImageSrc}
                authorName={post.authorName}
                timeStamp={post.timeStamp}
                comments={post.comments ? post.comments : []}
                postBody={post.postBody}
                postImageSrc={post.postImageSrc}
                label={post.label}
                postTitle={post.postTitle}
                postDescription={post.postDescription}
                emojisCount={post.emojisCount}
                commentsCount={post.commentsCount}
                isLiked={post.isLiked}
                isCommented={post.isCommented}
                sharesCount={post.sharesCount}
                onLike={() => handleLike(index)}
                onShare={() => handleShare(index)}
                onComment={(comment) => handleComment(index, comment)}
              />
            ))}
          </div>
        </div>

        <div className="column-right desktop-tablet-only"></div>
        <div className="new-post-button">
          <i className="new-post-icon"></i>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
