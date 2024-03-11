import React from "react";

function FriendshipDetails({ friendshipStatus, handleAddFriend, handleRemoveFriend }) {
    return (
        <>
            {friendshipStatus ? (
                <div>
                    {friendshipStatus.status === "pending" && <span>Pending friend request...</span>}
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
