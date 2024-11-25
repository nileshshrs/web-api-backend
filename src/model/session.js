import mongoose from "mongoose";
import { fifteenDaysFromNow } from "../utils/date.js";


const sessionSchema = new mongoose.Schema({
    userID: {
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId, //references the types in mongoose schema
        index: true,
    },
    userAgent: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, default: fifteenDaysFromNow }
})


const SessionModel = mongoose.model("Session", sessionSchema)

export default SessionModel