import { conversationModel } from "../model/conversation.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

// Define the conversation controller
export const createConversationController = catchErrors(
    async (req, res) => {

        //since you dont need to implement a lot of logic you don't really need to create a service file for the business logic
        const { participants } = req.body;

        participants.sort()
        const existingConversation = await conversationModel.findOne({ participants })

        if (existingConversation) {
            //testing if the conversation gets updated
            // existingConversation.lastMessage = "this is a test update to see if the date gets updated correctly."
            // await existingConversation.save()
            return res.status(CREATED).json({
                message: "conversation already exist",
                existingConversation
            }) //
        }

        // Respond with a success message and the created conversation
        return res.status(CREATED).json({
            message: "Conversation created successfully.",
            conversation, // Return the conversation object
        });
    }
);


export const getConversationController = catchErrors(async (req, res) => {
    const userID = req.userID;
    console.log(userID);

    const conversation = await conversationModel
        .find({ participants: userID })
        .populate("participants", "username");

    appAssert(conversation, NOT_FOUND, "Conversation not found.");

    return res.status(OK).json(conversation);
})