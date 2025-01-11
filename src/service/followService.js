import { followModel } from "../model/follow.js";

// Service to fetch the followings for a user
export const getUserFollowings = async (userId) => {
    return await followModel.find({ follower: userId })
        .populate("follower", "username image email")
        .populate("following", "username image email");
};

// Service to fetch and populate followings of a user
export const getPopulatedFollowings = async (userId) => {
    return await followModel.find({ follower: userId })
        .populate("follower", "username image email")
        .populate("following", "username image email");
};

// Service to compare two users' followings and mark matches
export const compareFollows = (user1Followings, user2Followings) => {
    // Create a map of user2's following IDs for comparison
    const user1FollowingIds = user1Followings.map(follow => follow.following._id.toString());

    // Compare user1's followings with user2's and add `match: true` if common
    return user2Followings.map(follow => {
        const isMatch = user1FollowingIds.includes(follow.following._id.toString());
        return {
            ...follow.toObject(),
            match: isMatch,  // Add match field to indicate if the user follows the same person
        };
    });
};

// Service to fetch the followings for a user
export const getUserFollowers = async (userId) => {
    return await followModel.find({ following: userId })
        .populate("follower", "username image email")
        .populate("following", "username image email");
};

// Service to fetch and populate followings of a user
export const getPopulatedFollowers = async (userId) => {
    return await followModel.find({ following: userId })
        .populate("follower", "username image email")
        .populate("following", "username image email");
};

