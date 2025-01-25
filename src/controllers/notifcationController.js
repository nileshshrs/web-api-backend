import { notificationModel } from "../model/notification.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const createNotificationController = catchErrors(async (req, res) => {
    const userID = req.userID;
    const { recipient, type, post } = req.body;


    const notification = await notificationModel.create({
        recipient: recipient,
        sender: userID,
        type: type,
        post: post
    })

    appAssert(notification, CONFLICT, "error occurred while creating a notificaition")
    return res.status(CREATED).json({
        message: "notification created successfully",
        notification
    })
})

export const updateNotificationController = catchErrors(async (req, res) => {
    const userID = req.userID;

    const updatedNotifications = await notificationModel.updateMany(
        { recipient: userID },  // Filter notifications for this recipient
        { $set: { read: true } }, // Set the `read` field to true
        { new: true, timestamps: false } // Return the updated documents
    );


    return res.status(OK).json({
        message: "notifcations updated successfully",
    })
})

export const getAllNotificationsController = catchErrors(async (req, res) => {
    const userID = req.userID;


    const notifications = await notificationModel
        .find({ recipient: userID })
        .populate("sender", "username image") // Populate sender with name, image
        .populate({
            path: "post", // Optional population of post
            select: "image", // Specify the fields to return
            match: { _id: { $exists: true } }, // Optional match to ensure post exists
        }).sort({ createdAt: -1 });


    appAssert(notifications, NOT_FOUND, `notifications from user with id ${userID} not found`)

    return res.status(OK).json(
        notifications
    );
})