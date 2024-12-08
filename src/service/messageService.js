import { conversationModel } from "../model/conversation.js";
import { messageModel } from "../model/message.js";

export const createMessage = async (message) => {
    const { sender, conversation, recipient, content } = message;


    const create = await messageModel.create({
        sender: sender,
        conversation: conversation,
        recipient: recipient,
        content: content,
    })

    await conversationModel.findByIdAndUpdate(conversation,
        {
            lastMessage: content
        }
    )

    return create;
}