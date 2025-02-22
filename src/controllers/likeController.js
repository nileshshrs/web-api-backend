import { likeModel } from "../model/like.js";
import { postModel } from "../model/posts.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const toggleLikeController =catchErrors(
    async(req, res)=>{
        const {userID, postID} = req.body


        const  post = await postModel.findById({_id: postID});

        appAssert(post, NOT_FOUND, "post not found");

        const existingLike = await likeModel.findOne({post:postID, user: userID});

        if(existingLike)    {
            await likeModel.findByIdAndDelete({_id: existingLike._id});

            return res.status(OK).json({
                message: "post unliked."
            })
        }else{
            const like = await likeModel.create({
                post: postID,
                user: userID
            })
          
            const populatedLike = await likeModel
            .findById(like._id)
            .populate({
                path: 'post',
                select: 'user' // Only include the user ID of the post owner
              });;

            appAssert(like, CONFLICT, "an error occured when liking a post.")

            return res.status(CREATED).json({
                populatedLike, 
                message: "post liked successfully."
            })
        }
    }
)

export const getPostLikedData= catchErrors(
    async(req, res)=>{
        const {id} = req.params;
        const userID = req.userID;

        const post = await postModel.findById({_id: id});
        appAssert(post, NOT_FOUND, "post not found");

        const likeCount = await likeModel.countDocuments({post: id});
      
        const userLiked = await likeModel.findOne({post: id, user: userID});

        return res.status(OK).json({ likeCount, userLiked: Boolean(userLiked)});
    }
)

