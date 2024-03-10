import React from "react";

function FriendDetails({ first_name, last_name, email, profile_picture }) {
    return (
        <div className="post-author-info">
            <img src={profile_picture} alt="Author" />
            <div>
                <span className="author-name">
                    Name: {first_name} {last_name}
                </span>
            </div>
            <div>
                <span className="author-name">Email: {email}</span>
            </div>
        </div>
    );
}

export default FriendDetails;
