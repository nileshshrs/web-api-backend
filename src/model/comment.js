import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    comment: { type: String, required: true },
}, { timestamps: true })

export const commentModel = mongoose.model("comment", commentSchema);