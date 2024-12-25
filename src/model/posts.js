import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image: { type: [String] },
}, { timestamps: true })

export const postModel = mongoose.model("posts", postSchema);