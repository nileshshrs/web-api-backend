import { conversationModel } from "../model/conversation.js";
import { createConversation, updateConversation } from "../service/conversationService.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

// Define the conversation controller
export const createConversationController = catchErrors(
    async (req, res) => {
        const userID = req.userID
        const { participants } = req.body
        participants.sort()
        const conversation = await createConversation(participants, userID)
        appAssert(conversation, NOT_FOUND, "failed to create conversation.")

        return res.status(CREATED).json({ message: "conversation created successfully", conversation });
    }
);


export const getConversationController = catchErrors(async (req, res) => {
    const userID = req.userID;

    const conversation = await conversationModel
        .find({ participants: userID })
        .populate("participants", "username image")
        .populate("title", "username image")
        .sort({ updatedAt: -1 });;

    appAssert(conversation, NOT_FOUND, "conversation not found.");

    return res.status(OK).json(conversation);
})

export const updateConversationController = catchErrors(async (req, res) => {
    const userID = req.userID;
    const conversationID = req.params.id;

    const conversation = await updateConversation(userID, conversationID);

    return res.status(OK).json({
        message: "Conversation deleted successfully.",
        conversation, // Return the updated conversation object
    })

})

export const getConversationByIDController = catchErrors(async (req, res) => {
    const conversationID = req.params.id;


    const conversation = await conversationModel.findById({ _id: conversationID })
        .populate("participants", "username image")
        .populate("title", "username image")


    appAssert(conversation, NOT_FOUND, `conversation with id: ${conversationID} does not exist.`)

    return res.status(OK).json(
        conversation, // Return the updated conversation object
    );
})


export const updateReadConversationController = catchErrors(async (req, res) => {
    const { id } = req.params;
    const conversationID = id;

    const conversation = await conversationModel.findOneAndUpdate(
        { _id: conversationID }, // Ensure the user is part of the conversation
        { $set: { read: null } }, // Set the 'read' field to null
        { new: true, timestamps: false } // Return the updated conversation
    );
    appAssert(conversation, NOT_FOUND, `conversation with id: ${conversationID} does not exist.`);

    return res.status(OK).json({
        message: "Conversation marked as unread successfully.",
        conversation,
    });

})