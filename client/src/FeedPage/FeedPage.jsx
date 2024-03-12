import React, { useState, useEffect } from "react";
import Post from "./Post.jsx";
import WritePost from "./WritePost.jsx";
import "./styles.css";
import { Link, useParams } from 'react-router-dom';


const FeedPage = () => {
    // State for dark mode
    const [darkMode, setDarkMode] = useState(false);

    // State for posts
    const [posts, setPosts] = useState([]);
    const userId  = localStorage.getItem('userId')
    const [userDetails, setUserDetails] = useState({});

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

        const fetchDetails = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                });
                if (res.status !== 201) {
                    alert("Failed fetch details for user");
                    return;
                }
                const resBody = await res.json();
                setUserDetails(resBody.user);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
        fetchDetails();
    }, []);
    // Effect to apply dark mode styles
    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
    }, [darkMode]);

    // Function to handle liking a post
    const handleLike = async (index) => {
        try {
            const updatedPosts = [...posts];
            const post = updatedPosts[index];

            if (post.isLiked) {
                post.likes_count -= 1;
            } else {
                post.likes_count += 1;
            }
            post.isLiked = !post.isLiked;

            const res = await fetch(`http://localhost:3000/api/users/${post.user_id._id}/posts/${post._id}/action`, {
                method: "PUT",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    likes_count: post.likes_count,
                    isLiked: post.isLiked
                }),
            });
            if (res.status !== 201) {
                alert(`Failed liking post with id = ${post._id}`);
                return;
            }
            setPosts(updatedPosts);
        } catch (err) {
            console.log(err);
        }
    };

    // Function to handle sharing a post
    const handleShare = async (index) => {
        try {
            const updatedPosts = [...posts];
            const post = updatedPosts[index];

            const sharedPost = { ...posts[index], author_name: "Shared by You" };

            const res = await fetch(`http://localhost:3000/api/users/${post.user_id._id}/posts/${post._id}/action`, {
                method: "PUT",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    author_name: "Shared by You"
                }),
            });
            if (res.status !== 201) {
                alert(`Failed sharing post with id = ${post._id}`);
                return;
            }
            setPosts([sharedPost, ...posts]);
        } catch (err) {
            console.log(err);
        }
    };

    // Function to handle commenting on a post
    const handleComment = async (index, comment) => {
        try {
            const updatedPosts = [...posts];
            const post = updatedPosts[index];
            const user = userDetails;
            const newComment = {'user_id': user, 'content': comment}
            
            updatedPosts[index].comments ? updatedPosts[index].comments.push(newComment) : (updatedPosts[index].comments = [newComment]);

            const res = await fetch(`http://localhost:3000/api/users/${post.user_id._id}/posts/${post._id}/action`, {
                method: "PUT",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comments: updatedPosts[index].comments
                }),
            });
            if (res.status !== 201) {
                alert(`Failed commenting post with id = ${post._id}`);
                return;
            }
            setPosts(updatedPosts);
        } catch (err) {
            console.log(err);
        }
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
                {/* User profile image */} 
                <div className="user-profile">
                    <Link to={`/user/${userId}`}> 
                        {userDetails && userDetails.user && <img src={userDetails.user.profile_picture} alt="User Profile" className="profile-image" />}
                    </Link>
                </div>
                {/* Dark mode toggle button */}
                <div className="dark-mode-toggle" onClick={toggleDarkMode}>
                    <i className="toggle-icon"></i>
                    <span style={{ color: `${darkMode ? "#FFF" : "#000"}` }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </div>
                <div className="column-center">
                    <div className="content-area">
                        <WritePost />
                        {posts.length > 0 &&
                            posts.map((post, index) => (
                                <Post
                                    key={index}
                                    userId={post.user_id}
                                    authorImageSrc={post.author_image}
                                    authorName={post.author_name}
                                    timeStamp={post.created_at}
                                    comments={post.comments.content ? post.comments.content : []}
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
