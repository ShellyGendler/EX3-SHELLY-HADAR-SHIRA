import React, { useEffect, useState } from "react";
import Post from "../FeedPage/Post.jsx";
import FeedPage from "../FeedPage/FeedPage.jsx";
import { useParams } from "react-router-dom";

function UserPage() {
    const isFriend = true;
    const friendId = "12345";
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
    }, []);

    const handleRemoveFriend = async (friendId) => {
        const res = await fetch(`http://localhost:3000/api/users/${userId}/friends/${friendId}`, {
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
        alert(`friend with id ${friendId} was removed from ${userId}`);
    };

    const handleAddFriend = async (friendId) => {
        const res = await fetch(`http://localhost:3000/api/users/${friendId}/friends}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ currentUserId: userId }),
        });
        if (res.status !== 200) {
            const resBody = await res.json();
            alert(resBody.message);
            return;
        }
        alert(`friend with id ${friendId} was added`);
    };

    return (
        <div className="content-grid">
            <div className="column-left desktop-tablet-only"></div>

            <div className="column-center">
                <div className="content-area">
                    {userDetails && userDetails.user && (
                        <>
                            <h2>
                                {userDetails.user.first_name} {userDetails.user.last_name}
                            </h2>
                            <div>
                                <span>Email: {userDetails.user.email}</span>
                            </div>
                            <div>
                                {userDetails.friendshipStatus && userDetails.friendshipStatus.status === "pending" && <button onClick={() => handleAddFriend(friendId)}>Add Friend</button>}
                                {userDetails.friendshipStatus && userDetails.friendshipStatus.status === "accepted" && <button onClick={() => handleRemoveFriend(friendId)}>Remove Friend</button>}
                            </div>
                            <h3>Friends</h3>
                            {friends ? (
                                friends.map((friend, index) => (
                                    <>
                                        <div className="post-author-info">
                                            <img src={friend.profile_picture} alt="Author picture" />
                                            <div>
                                                <span className="author-name">
                                                    Name: {friend.first_name} {friend.last_name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="author-name">Email: {friend.email}</span>
                                            </div>
                                        </div>
                                    </>
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
                                        onLike={() => FeedPage.handleLike(index)}
                                        onShare={() => FeedPage.handleShare(index)}
                                        onComment={(comment) => FeedPage.handleComment(index, comment)}
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
