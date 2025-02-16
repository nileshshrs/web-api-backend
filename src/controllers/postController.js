import { followModel } from "../model/follow.js";
import { postModel } from "../model/posts.js";
import { getPostsService } from "../service/postService.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const createPostController = catchErrors(
    async (req, res) => {
        const userID = req.userID;
        const { content, image } = req.body;

        // Create the post object
        const post = {
            user: userID,  // Attach the user ID
            content,  // Use the content from the request
            image: image || []  // If no image is provided, default to an empty array
        };

        // Create the post in the database
        const newPost = await postModel.create(post);

        // Assert that the post was created successfully
        appAssert(newPost, CONFLICT, "failed to create a post");

        // Return the newly created post
        return res.status(CREATED).json(newPost);
    }
);

//this is get all posts from user and the user he is following
export const getPostController = catchErrors(
    async (req, res) => {
        const userID = req.userID; // Get the userID from the authenticated request
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        // Call the service to get the posts
        const posts = await getPostsService(userID, page, limit);

        // Respond with the posts
        res.status(OK).json(posts);
    }
);
export const getMobilePostController = catchErrors(
    async (req, res) => {
        const userID = req.userID; // Get the userID from the authenticated request

        const following = await followModel.find({ follower: userID }).select("following");
        const followedUserIds = following.map((f) => f.following);
        followedUserIds.push(userID);  // Include the user's own posts

        // Fetch posts from the followed users (sorted by latest posts, without pagination)
        const query = { user: { $in: followedUserIds } };
        const sort = { createdAt: -1 }; // Sort by latest posts

        const posts = await postModel
            .find(query)
            .populate("user", 'username image')
            .sort(sort)

        // Respond with the posts
        res.status(OK).json(posts);
    }
);

//this is for user only since there is only when user visits his account page not to be mistaken for visiting oter user's account page
export const getPostsByUserController = catchErrors(
    async (req, res) => {
        const userID = req.userID;
        // Find all posts by the user
        const posts = await postModel.find({ user: userID });

        appAssert(posts, NOT_FOUND, `posts from user with ${userID} not found.`)

        res.status(OK).json(posts);
    }
)


export const getPostsByUserIDController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        // Find all posts by the user
        const posts = await postModel.find({ user: id });

        appAssert(posts, NOT_FOUND, `posts from user with ${id} not found.`)

        res.status(OK).json(posts);
    }
)


