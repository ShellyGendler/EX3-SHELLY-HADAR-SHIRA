
const Friendship = require("../models/Friendship");
const Post = require("../models/Post");
const tcpClient = require('../tcpClient');



function extractUrl(text) {
   // Enhanced Regex to find URLs including those with subdomains or ports
    // This pattern matches http, https, and ftp URLs more comprehensively
    const urlRegex = /(\bhttps?:\/\/|ftp:\/\/)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/ig;

    // Search for URLs using the regex
    const urls = text.match(urlRegex);
    
    // Return the first URL found or null if no URL is found
    return urls ? urls[0] : null;
}


const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const isFriends = async (user1, user2) => {
            const friendship = await Friendship.findOne({
                $or: [
                    { user_id: user1, friend_id: user2 },
                    { user_id: user2, friend_id: user1 },
                ],
                status: "accepted",
            });
            return !!friendship;
        };
        if (userId === req.currentUserId || (await isFriends(req.currentUserId, userId))) {
            const posts = await Post.find({ user_id: userId }).sort({
                created_at: -1,
            });
            res.status(200).json(posts);
        } else {
            res.status(403).json({ message: "Can't access user's posts" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed getting user: " + error.message });
    }
};

const createNewPost = async (req, res) => {
    try {
        if (req.currentUserId !== req.params.id) {
            res.status(403).json({ error: "Unauthorized request" });
            return;
        }
        const post = new Post({
            ...req.body,
            user_id: req.currentUserId,
        });
        
        const url = extractUrl(post.content);
        if(url != null) {
            tcpClient.sendData("2 "+url);
            let response = await tcpClient.receiveData();
            if(response == "true\n"){
                console.log(`Post is Illegal, please verify the post and resend it`);
                res.status(403).json({ error: "Post is Illegal, please verify the post and resend it" });
                return;
            }else {
                    console.log(`Post is OK`);
            }
        }
        const result = await post.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed sending request", error: error.message });
    }
};

const updatePostById = async (req, res) => {
    try {
        const userId = req.params.id;
        const postId = req.params.pid;
        const updatedProps = req.body;

        if (req.currentUserId !== userId) {
            res.status(403).json({ error: "Unauthorized request" });
            return;
        }

        const url = extractUrl(updatedProps.content);
        if(url != null) {
            tcpClient.sendData("2 "+url);
            let response = await tcpClient.receiveData();

            if(response == "true\n"){
                console.log(`Post is Illegal, please verify the post and resend it`);

                res.status(403).json({ error: "Post is Illegal, please verify the post and resend it" });
                return;

            }else {
                console.log(`Post is OK`);

            }
        }

        const updatedPost = await Post.findOneAndUpdate({ _id: postId }, updatedProps, { new: true });

        if (!updatedPost) {
            res.status(500).json({ message: "Post not found" });
        }

        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: "Failed getting user: " + error.message });
    }
};

const actionOnPostById = async (req, res) => {
    try {
        const postId = req.params.pid;
        const updatedProps = req.body;

        const updatedPost = await Post.findOneAndUpdate({ _id: postId }, updatedProps, { new: true });

        if (!updatedPost) {
            res.status(500).json({ message: "Post not found" });
        }

        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: "Failed getting user: " + error.message });
    }
};

const deletePostById = async (req, res) => {
    const userId = req.params.id;
    const postId = req.params.pid;

    try {
        if (req.currentUserId !== userId) {
            res.status(403).json({ error: "Unauthorized request" });
            return;
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.currentUserId;

        const friends = await Friendship.find({
            $or: [{ user_id: userId }, { friend_id: userId }],
            status: "accepted",
        });

        const friendsIds = friends.map((friendship) => (friendship.user_id == userId ? friendship.friend_id : friendship.user_id));

        const friendsPosts = await Post.find({ user_id: { $in: friendsIds } })
            .limit(20)
            .sort({ created_at: -1 })
            .populate("user_id");

        const notFriendsPosts = await Post.find({ user_id: { $nin: friendsIds } })
            .limit(5)
            .sort({ created_at: -1 })
            .populate("user_id");

        res.status(200).json([...friendsPosts, ...notFriendsPosts]);
    } catch (error) {
        res.status(500).json({ error: "Failed getting user: " + error.message });
    }
};

module.exports = {
    getPostsByUserId,
    createNewPost,
    updatePostById,
    deletePostById,
    getFeedPosts,
    actionOnPostById
};
