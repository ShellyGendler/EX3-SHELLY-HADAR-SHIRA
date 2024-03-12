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
        alert(`Deleted friendship of ${userDetails.first_name} successfully`);
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
        
        alert(`Sent friendship request to ${userDetails.first_name} successfully`);
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
                                        onLike={() => FeedPage.handleLike(index)}
                                        onShare={() => FeedPage.handleShare(index)}
                                        onComment={(comment) => FeedPage.handleComment(index, comment)}
                                        onDelete={() => FeedPage.handleRemovePost(index)}
                                        onEdit={(editedBody) => FeedPage.handleEditPost(index, editedBody)}
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
