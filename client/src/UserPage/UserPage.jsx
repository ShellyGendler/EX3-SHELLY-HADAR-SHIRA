import React, { useEffect, useState } from "react";
import Post from "../FeedPage/Post.jsx";
import FeedPage from "../FeedPage/FeedPage.jsx";
import { useParams } from "react-router-dom";
import FriendDetails from "./FriendDetails.jsx";
import FriendshipDetails from "./FriendshipDetails.jsx";

function UserPage() {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState();
    const [posts, setPosts] = useState();
    const [friends, setFriends] = useState();

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
            const user = userDetails.user;
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

    useEffect(() => {
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
                setUserDetails(resBody);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchFriends = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/users/${userId}/friends`, {
                    method: "GET",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                });
                if (res.status !== 200) {
                    return;
                }
                const resBody = await res.json();
                setFriends(resBody);
            } catch (err) {
                console.log(err);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/users/${userId}/posts`, {
                    method: "GET",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                });
                if (res.status !== 200) {
                    return;
                }
                const resBody = await res.json();
                setPosts(resBody);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDetails();
        fetchFriends();
        fetchPosts();
    }, [userId]);

    const handleRemoveFriend = async () => {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`http://localhost:3000/api/users/${userId}/friends/${userDetails.user._id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });
        if (res.status !== 200) {
            const resBody = await res.json();
            alert(resBody.message);
            return;
        }
    
        const updatedFriends = friends.filter((friend) => friend.id !== userDetails.user._id);
        setPosts(updatedFriends);
        alert(`Deleted friendship of ${userDetails.user.first_name} successfully`);
    };

    const handleAcceptFriend = async () => {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`http://localhost:3000/api/users/${userId}/friends/${userDetails.user._id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });
        if (res.status !== 200) {
            const resBody = await res.json();
            alert(resBody.message);
            console.log(resBody.error);
            return;
        }
        alert(`Accepted friendship of ${userDetails.user.first_name} successfully`);
    };

    const handleAddFriend = async () => {
        const res = await fetch(`http://localhost:3000/api/users/${userId}/friends`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ currentUserId: localStorage.getItem("userId") }),
        });
        if (res.status !== 200) {
            const resBody = await res.json();
            alert(resBody.message);
            return;
        }
        
        alert(`Sent friendship request to ${userDetails.user.first_name} successfully`);
    };

    return (
        <div className="content-grid">
            <div className="column-left desktop-tablet-only"></div>

            <div className="column-center">
                <div className="content-area">
                    {userDetails && userDetails.user && (
                        <>
                            <img src={userDetails.user.profile_picture} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', }} alt="profile pic" />
                            <h2>
                                {userDetails.user.first_name} {userDetails.user.last_name}
                            </h2>
                            <div>
                                <span>Email: {userDetails.user.email}</span>
                            </div>
                            <div>
                                <FriendshipDetails
                                        friendUserId={userDetails.user._id}
                                        friendshipStatus={userDetails.friendshipStatus}
                                        handleAddFriend={handleAddFriend}
                                        handleRemoveFriend={handleRemoveFriend}
                                        handleAcceptFriend={handleAcceptFriend}
                                    />                            
                            </div>
                            <h3>Friends</h3>
                            {friends ? (
                                friends.map((friend, index) => (
                                    <FriendDetails key={friend.email} first_name={friend.first_name} last_name={friend.last_name} email={friend.email} profile_picture={friend.profile_picture} friend_id={friend._id} />
                                ))
                            ) : (
                                <div>You are not a friend of {userDetails.user.first_name} and cannot see the friends. </div>
                            )}
                            <h3>Posts</h3>
                            {posts ? (
                                posts.map((post, index) => (
                                    <Post
                                        key={index}
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
                                ))
                            ) : (
                                <div>You are not a friend of {userDetails.user.first_name} and cannot see the posts. </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserPage;
