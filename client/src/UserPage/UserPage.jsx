import Post from "../FeedPage/Post.jsx";
import FeedPage from "../FeedPage/FeedPage.jsx";

const token = localStorage.getItem("token");

const user = {
    userId: "1223",
    firstName: "Danielle",
    lastName: "Kupitman",
    userName: "daniellekup",
    email: "danielle@gmail.com",
    password: "dk123456",
    passwordAuth: "dk123456",
};
function UserPage({ userId, friends }) {
    // const user = await axios.get(http://localhost:3000/${userId}, { userId: userId })
    const isFriend = true;
    const friendId = "12345";

    // const allPosts = axios.post(http://localhost:3000/${userId}/posts, { userId: userId });

    const handleRemoveFriend = async (friendId) => {
        const postData = {
            userId: userId,
            friendId: friendId,
        };
        const res = await fetch(`http://localhost:3000/api/users/${userId}/friends/${friendId}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(postData),
        });
        const resBody = await res.json();
        if (res.status !== 200) {
            alert(res.status.error);
            return;
        }
        alert(`friend with id ${friendId} was removed from ${userId}`);
    };

    const handleAddFriend = async () => {
        const res = await fetch(`http://localhost:3000/api/users/${userId}/friends}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(postData),
        });
        if (res.status !== 200) {
            alert(res.status.error);
            return;
        }
        alert(`friend with id ${userId} was added`);
    };

    return (
        <div className="user-page">
            {user && user.userId && (
                <>
                    <h2>
                        {user.firstName} {user.lastName}
                    </h2>
                    <div>
                        <span>Username: {user.userName}</span>
                        <span>Email: {user.email}</span>
                    </div>
                    <div>
                        {isFriend ? ( // TODO: check that the user's page is not mine and then check if a friend or not
                            <button onClick={() => handleRemoveFriend(friendId)}>Remove Friend</button>
                        ) : (
                            <button onClick={() => handleAddFriend()}>Add Friend</button>
                        )}
                    </div>
                    <h3>Posts</h3>
                    {/* {allPosts.map((post, index) => (
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
                        onLike={() => FeedPage.handleLike(index)}
                        onShare={() => FeedPage.handleShare(index)}
                        onComment={(comment) => FeedPage.handleComment(index, comment)}
                    />))} */}
                </>
            )}
        </div>
    );
}

export default UserPage;
