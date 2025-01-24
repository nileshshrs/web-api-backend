import { followModel } from "../model/follow.js";
import {
    compareFollowers,
    compareFollowings,
    getPopulatedFollowers,
    getPopulatedFollowings,
    getUserFollowers,
    getUserFollowings
} from "../service/followService.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const createFollowerController = catchErrors(async (req, res) => {
    const follower = req.userID;
    const following = req.params.id;

    const existingFollow = await followModel.findOne({ follower, following });
    appAssert(!existingFollow, CONFLICT, "the user is already being followed by you.");

    const follow = await followModel.create({
        follower,
        following
    })

    return res.status(CREATED).json({
        message: "followed successfully",
        follow
    })
})

//follower is always user/ following is alway user2 who user 1 follows
export const getFollowingController = catchErrors(async (req, res) => {
    const user = req.userID;  // Current logged-in user
    const { id } = req.params;  // ID from the request parameters (the user profile you're viewing)

    // If the user is viewing their own profile (i.e., req.userID === req.params.id)
    if (user === id) {
        // Fetch followings for the current user (without populating)
        const following = await getUserFollowings(user);
        // console.log(following, "following controller")
        return res.status(OK).json(following);
    } else {
        // Fetch followings for the current user (req.userID) with population
        const userFollowing = await getPopulatedFollowings(user);
        // Fetch followings for the user specified in the request parameters (req.params.id) with population
        const user2Following = await getPopulatedFollowings(id);

        // Compare followings and add `match: true` if the user follows the same person
        const followingData = compareFollowings(userFollowing, user2Following);
        // console.log(followingData, "following controller")


        // Return the result with the match field included if applicable
        return res.status(OK).json(followingData);
    }
});


export const getFollowerController = catchErrors(async (req, res) => {
    const user = req.userID;  // Current logged-in user
    const { id } = req.params;  // ID from the request parameters (the user profile you're viewing)

    // If the user is viewing their own profile (i.e., req.userID === req.params.id)
    if (user === id) {
        // Fetch followings for the current user (without populating)
        const follower = await getUserFollowers(user);
        return res.status(OK).json(follower);
    } else {
        // Fetch followings for the current user (req.userID) with population
        const userFollower = await getPopulatedFollowings(user);
        // Fetch followings for the user specified in the request parameters (req.params.id) with population
        const user2Follower = await getPopulatedFollowers(id);

        // Compare followings and add `match: true` if the user follows the same person
        const followerData = compareFollowers
            (userFollower, user2Follower);

        // Return the result with the match field included if applicable
        return res.status(OK).json(followerData);
    }
})



export const unfollowController = catchErrors(async (req, res) => {
    const { followerID, followingID } = req.body;

    const unfollow = await followModel.findOneAndDelete({ follower: followerID, following: followingID });
    appAssert(unfollow, NOT_FOUND, "the user is not being followed by you.");

    return res.status(OK).json({ message: "unfollowed successfully" })

})

export const deleteFollowController = catchErrors(async (req, res) => {
    const id = req.params.id;
    const unfollow = await followModel.findByIdAndDelete({ _id: id });
    appAssert(unfollow, NOT_FOUND, "follow not found");
    return res.status(OK).json({ message: "follow deleted successfully" })

})

export const getConnectionController = catchErrors(async (req, res) => {
    const id = req.userID
    const followers = await followModel.find({ following: id })
        .populate("follower", "username image email")
        .select("follower");

    // Get following
    const following = await followModel.find({ follower: id })
        .populate("following", "username image email")
        .select("following");

    // Structure the response
    let connections = [
        ...followers.map((f) => f.follower), // Add followers
        ...following.map((f) => f.following), // Add following
    ];
    connections = connections.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t._id.toString() === value._id.toString()
        ))
    );
    appAssert(connections, NOT_FOUND, "no conversation found")

    return res.status(OK).json(connections);
})