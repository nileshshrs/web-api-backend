import { postModel } from "../model/posts.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED } from "../utils/constants/http.js";

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
