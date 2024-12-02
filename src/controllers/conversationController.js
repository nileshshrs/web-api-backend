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
    const userID = "6749cd4a23387321e3605545";

    const conversation = await conversationModel
        .find({ participants: userID })
        .populate("participants", "username")
        .populate("title","username");

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