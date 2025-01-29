import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    post: {type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
}, {timestamps: true});

export const likeModel = mongoose.model("like", likeSchema);