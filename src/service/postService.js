import { followModel } from "../model/follow.js";
import { postModel } from "../model/posts.js";

export const getPostsService = async (userID, page, limit) => {
    const skip = (page - 1) * limit;
    // Fetch the users that the given user is following
    const following = await followModel.find({ follower: userID }).select("following");
    const followedUserIds = following.map((f) => f.following);
    followedUserIds.push(userID);  // Include the user's own posts

    // Fetch posts from the followed users (sorted by latest posts, without pagination)
    const query = { user: { $in: followedUserIds } };
    const sort = { createdAt: -1 }; // Sort by latest posts

    const posts = await postModel.find(query).sort(sort).skip(skip).limit(limit);

    return posts;
};
