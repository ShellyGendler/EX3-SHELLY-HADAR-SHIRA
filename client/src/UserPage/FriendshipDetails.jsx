import React from "react";

function FriendshipDetails({ friendshipStatus, handleAddFriend, handleRemoveFriend }) {
    return (
        <>
            {friendshipStatus ? (
                <div>
                    {friendshipStatus.status === "pending" && <button onClick={handleAddFriend}>Add Friend</button>}
                    {friendshipStatus.status === "accepted" && <button onClick={handleRemoveFriend}>Remove Friend</button>}
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
