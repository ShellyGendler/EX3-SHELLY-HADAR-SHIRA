import React, { useState, useEffect } from "react";
import Post from "./Post.jsx";
import WritePost from "./WritePost.jsx";
import "./styles.css";

const FeedPage = () => {
    // State for dark mode
    const [darkMode, setDarkMode] = useState(false);

    // State for posts
    const [posts, setPosts] = useState([]);

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/posts", {
                    method: "GET",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                });
                if (res.status !== 200) {
                    alert("Failed fetch data");
                    return;
                }
                const resBody = await res.json();
                setPosts(resBody);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);
    // Effect to apply dark mode styles
    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
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
        updatedPosts[index].comments ? updatedPosts[index].comments.push(comment) : (updatedPosts[index].comments = [comment]);
        updatedPosts[index].isCommented = true;
        setPosts(updatedPosts);
    };

    const handleRemovePost = async (index) => {
        try {
            const post = posts[index];
            if(post.user_id._id !== localStorage.getItem("userId")){
                alert("you can only delete your own posts!")
                return;
            }

            const res = await fetch(`http://localhost:3000/api/users/${post.user_id._id}/posts/${post._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            });
            if (res.status !== 200) {
                alert(`Failed removing post with id = ${post._id}`);
                return;
            }
            const updatedPosts = [...posts];
            updatedPosts.splice(index, 1);
            setPosts(updatedPosts);
        } catch (err) {
            console.log(err);
        }
      };

      const handleEditPost = async (index, updatedBodyPost) => {
        try {
            const post = posts[index];
            if(post.user_id._id !== localStorage.getItem("userId")){
                alert("you can only edit your own posts!")
                return;
            }

            const res = await fetch(`http://localhost:3000/api/users/${post.user_id._id}/posts/${post._id}`, {
                method: "PUT",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postBody: updatedBodyPost
                }),
            });
            if (res.status !== 201) {
                alert(`Failed editing post with id = ${post._id}`);
                return;
            }
            post['content'] = updatedBodyPost;
            const updatedPosts = [...posts, post];
            setPosts(updatedPosts);
        } catch (err) {
            console.log(err);
        }
      };

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
                    <WritePost />
                    <div className="content-area">
                        {posts.length > 0 &&
                            posts.map((post, index) => (
                                <Post
                                    key={index}
                                    userId={post.user_id}
                                    authorImageSrc={post.author_image}
                                    authorName={post.author_name}
                                    timeStamp={post.created_at}
                                    comments={post.comments ? post.comments : []}
                                    postBody={post.content}
                                    postImageSrc={post.post_image_url}
                                    label={post.label}
                                    postTitle={post.title}
                                    postDescription={post.description}
                                    emojisCount={post.likes_count}
                                    commentsCount={post.comments.length}
                                    isLiked={post.isLiked}
                                    isCommented={post.isCommented}
                                    sharesCount={post.share_count}
                                    onLike={() => handleLike(index)}
                                    onShare={() => handleShare(index)}
                                    onComment={(comment) => handleComment(index, comment)}
                                    onDelete={() => handleRemovePost(index)}
                                    onEdit={(editedBody) => handleEditPost(index, editedBody)}
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
