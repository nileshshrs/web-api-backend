import { commentModel } from "../model/comment.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";


export const createCommentController = catchErrors(
    async (req, res) => {
        const userID = req.userID;

        const { post, comment } = req.body;
        console.log(post);

        let newComment = await commentModel.create({
            user: userID,
            post: post,
            comment: comment
        })
        newComment = await newComment.populate("user", "username image");

        appAssert(newComment, CONFLICT, "failed to create a new comment.")

        return res.status(CREATED).json({ message: "comment created successfully.", newComment });
    }
)

export const getComments = catchErrors(
    async (req, res) => {
        const { id } = req.params;

        const comments = await commentModel.find({ post: id }).populate("user", "username image");
        appAssert(comments, NOT_FOUND, `comments for post with id ${id} not found.`);

        return res.status(OK).json(comments);
    }
)

export const deleteCommentController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        const deleted = await commentModel.findByIdAndDelete(id)    ;
        appAssert(deleted, NOT_FOUND, "comment not found");
        return res.status(OK).json({ message: "comment deleted successfully." });
    }
)