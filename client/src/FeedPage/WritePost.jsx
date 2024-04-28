import React, { useEffect, useState } from "react";
import "./WritePost.css";

const PostForm = () => {
    const [userDetails, setUserDetails] = useState();
    const [postInputs, setPostInputs] = useState({
        postTitle: "",
        postContent: "",
        postImage: "",
    });

    useEffect(() => {
        const fetchDetails = async () => {
            const userId = localStorage.getItem("userId");
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
                const details = resBody.user;
                setUserDetails(details);
            } catch (err) {
                console.log(err);
            }
        };
        fetchDetails();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPostInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };
    const handleSubmitPost = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userDetails._id}/posts`, {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    author_image: userDetails.profile_picture,
                    author_name: `${userDetails.first_name} ${userDetails.last_name}`,
                    content: postInputs.postContent,
                    title: postInputs.postTitle,
                    post_image_url: postInputs.postImage,
                }),
            });
            if (res.status !== 200) {
                if(res.status == 403) {
                    alert("Post contains invalid URL, please rewrite the post"); 
                    return
                }
                alert("Failed posting: " + res);
                return;
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmitPost = async () => {
        if (postInputs.postContent.trim() === "" || postInputs.postTitle.trim() === "") {
            // Notify user about empty post
            alert("Please enter some content for your post.");
            return;
        }
        await handleSubmitPost(postInputs);

        setPostInputs({
            postTitle: "",
            postContent: "",
            postImage: "",
        });
    };

    return (
        <div className="post-form">
            <input type="text" name="postTitle" placeholder="title" value={postInputs.postTitle} onChange={handleInputChange} />
            <textarea placeholder="What's on your mind?" name="postContent" value={postInputs.postContent} onChange={handleInputChange} />
            <input
                id="files"
                type="file"
                name="postImage"
                onChange={(event) => {
                    // Check if files are selected
                    if (event.target.files.length > 0) {
                        // Get the first selected file
                        const selectedFile = event.target.files[0];

                        // picture to base64
                        const reader = new FileReader();
                        reader.readAsDataURL(selectedFile);

                        reader.onload = () => {
                            handleInputChange({ target: { name: event.target.name, value: reader.result } });
                        };
                    }
                }}
            />
            <button onClick={onSubmitPost}>Post</button>
        </div>
    );
};

export default PostForm;
