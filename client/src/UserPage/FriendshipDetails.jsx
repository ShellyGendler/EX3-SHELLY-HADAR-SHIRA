import React from "react";
import "./FriendshipDetails.css"

function FriendshipDetails({ friendUserId, friendshipStatus, handleAddFriend, handleRemoveFriend, handleAcceptFriend }) {
    return (
        <>
            {friendshipStatus ? (
                <div>
                    {friendshipStatus.status === "pending" &&
                        (friendUserId === friendshipStatus.friend_id ? (
                            <span>Your friend request is pending...</span>
                        ) : (
                             <button className="friendship-reques" onClick={handleAcceptFriend}>Accept friendship request </button>
                        ))} 
                    {friendshipStatus.status === "accepted" && <span>You are friends</span>}  
                    <br/>
                    <button className="cancel-friendship" onClick={handleRemoveFriend}>Cancel friendship </button>
                </div>
            ) : (
                <button className="remove-friend" onClick={handleAddFriend}>Add Friend </button>
            )}
        </>
    );
}

export default FriendshipDetails;
