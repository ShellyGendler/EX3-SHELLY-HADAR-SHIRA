import React, { useEffect, useState } from "react";

const PostForm = () => {
    const [userDetails, setUserDetails] = useState();
    const [postInputs, setPostInputs] = useState({
        postTitle: "",
        postContent: "",
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
                setUserDetails(resBody);
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
            const res = await fetch("http://localhost:3000/api/posts", {
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
                }),
            });
            if (res.status !== 200) {
                alert("Failed posting");
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

        setPostInputs((prevInputs) => {
            prevInputs.postContent = "";
            prevInputs.postTitle = "";
        });
    };

    return (
        <div className="post-form">
            <input type="text" name="postTitle" value={postInputs.postTitle} onChange={handleInputChange} />
            <textarea placeholder="What's on your mind?" name="postContent" value={postInputs.postContent} onChange={handleInputChange} />
            <button onClick={onSubmitPost}>Post</button>
        </div>
    );
};

export default PostForm;
