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
export const compareFollowers = (user1Followings, user2Followings) => {

    // Create a list of user1's following IDs as strings
    const user1FollowingIds = user1Followings.map(follow => follow.following._id.toString());


    // Compare user1's followings with user2's followers
    return user2Followings.map(follow => {
        const isMatch = user1FollowingIds.includes(follow.follower._id.toString()); // Ensure both are strings
        return {
            ...follow.toObject(),
            match: isMatch,  // Add match field to indicate if the user follows the same person
        };
    });
};

export const compareFollowings = (user1Followings, user2Followings) => {
    // Create a list of user2's following IDs as strings
    const user1FollowingIds = user1Followings.map(follow => follow.following._id.toString());

    // Compare user1's followings with user2's followings
    return user2Followings.map(follow => {
        const isMatch = user1FollowingIds.includes(follow.following._id.toString()); // Ensure both are strings
        return {
            ...follow.toObject(),
            match: isMatch, // Add match field to indicate if both users follow the same person
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


