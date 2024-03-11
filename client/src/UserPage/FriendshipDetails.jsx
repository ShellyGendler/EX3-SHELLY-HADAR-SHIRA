import React from "react";

function FriendshipDetails({ friendUserId, friendshipStatus, handleAddFriend, handleRemoveFriend, handleAcceptFriend }) {
    return (
        <>
            {friendshipStatus ? (
                <div>
                    {friendshipStatus.status === "pending" &&
                        (friendUserId === friendshipStatus.friend_id ? (
                            <span>Your friend request is pending...</span>
                        ) : (
                            <div className="action" onClick={handleAcceptFriend}>
                                <span>Accept friendship request</span>
                            </div>
                        ))}
                    {friendshipStatus.status === "accepted" && <span>You are friends</span>}
                    <div className="action" onClick={handleRemoveFriend}>
                        <span>Cancel friendship</span>
                    </div>
                </div>
            ) : (
                <div className="action" onClick={handleAddFriend}>
                    <i className="share-icon"></i>
                    <span>Add Friend</span>
                </div>
            )}
        </>
    );
}

export default FriendshipDetails;
