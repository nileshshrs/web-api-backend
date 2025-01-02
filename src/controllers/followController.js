import { followModel } from "../model/follow.js";
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

    const user = req.userID;

    const following = await followModel.find({ follower: user })
        .populate("follower", "username image")
        .populate("following", "username image");


    return res.status(OK).json({ following })
})


export const getFollowerController = catchErrors(async (req, res) => {
    const user = req.userID;

    const follower = await followModel.find({ following: user })
        .populate("follower", "username image")
        .populate("following", "username image");


    return res.status(OK).json({ follower })

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