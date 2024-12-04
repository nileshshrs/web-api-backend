import { messageModel } from "../model/message.js";
import { createMessage } from "../service/messageService.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK } from "../utils/constants/http.js";

export const createMessageController = catchErrors(
    async (req, res) => {
        const sender = req.userID; // gets the sender id from jwt access token verification
        const conversation = req.params.id // gets the conversation id from :/id in the api url
        const content = req.body

        const message = { sender, conversation, ...content };

        const createdMessage = await createMessage(message);

        return res.status(CREATED).json({
            message: "message created successfully.",
            createdMessage
        });
    }
);

export const getMessagesController = catchErrors(
    async (req, res) => {
        const sender = req.userID;

        const messages = await messageModel.find({ sender }).populate("sender", "username")

        return res.status(OK).json(messages);
    }
)