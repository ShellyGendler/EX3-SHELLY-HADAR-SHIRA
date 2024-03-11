import React from "react";
import { useNavigate } from "react-router-dom";

function FriendDetails({ first_name, last_name, email, profile_picture, friend_id }) {
    const navigate = useNavigate();

    const handleAuthorClick = async () => {
        try {
            navigate(`/user/${friend_id}`);
        } catch (err) {
            if (err.status) {
                alert(err.message);
                return;
            }
            console.log(err);
        }
    };

    return (
        <div className="post-author-info">
            <img src={profile_picture} alt="Author" onClick={handleAuthorClick} />
            <div>
                <span className="author-name" onClick={handleAuthorClick}>
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
