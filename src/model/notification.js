import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    read: { type: Boolean, default: false },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "posts", default: null },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
}, { timestamps: true });

export const notificationModel = mongoose.model("notifications", notificationSchema);