import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    lastMessage: { type: String, default: '' },
    title: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Reference to the User who deleted the conversation
    read: { type: String, default: null },

}, { timestamps: true })

conversationSchema.pre('save', function (next) {
    if (this.isModified('lastMessage')) {
        this.updatedAt = Date.now();
    }
    next();
});

export const conversationModel = mongoose.model("conversation", conversationSchema)