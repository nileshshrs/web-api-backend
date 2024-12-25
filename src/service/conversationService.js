import { conversationModel } from "../model/conversation.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT, NOT_FOUND, OK } from "../utils/constants/http.js";

export const updateConversation = async (userID, conversationID) => {

    const conversation = await conversationModel.findOne({
        _id: conversationID,
        participants: userID
    });

    appAssert(conversation, NOT_FOUND, "conversation not found.");

    if (conversation.participants.length === 1) {
        await conversationModel.deleteOne({ _id: conversationID });

        return ;
    }

    const updatedConversation = await conversationModel.findOneAndUpdate(
        { _id: conversationID },
        {
            $pull: { participants: userID }, // Remove the user from the participants array
            $set: { title: userID }  // Set the title to the user who deleted the conversation
        },
        { new: true }  // Ensure we get the updated conversation
    );

    appAssert(updatedConversation, CONFLICT, "Error updating conversation.");
    const populatedConversation = await updatedConversation.populate('title', 'username');

    return populatedConversation

}

export const createConversation = async (participants, userID) => {
    let existingConversation = await conversationModel.findOne({ participants });

    if (existingConversation) {

        // If the conversation exists, return the existing one
        return existingConversation;
    }

    existingConversation = await conversationModel.findOne({ title: userID });
    if (existingConversation) {
        console.log("inside second if check")
        const updatedConversation = await conversationModel.findOneAndUpdate(
            { _id: existingConversation._id },
            {
                $set: {
                    participants: participants, // Reset participants with the new array
                    title: null // Reset title (empty string instead of null)
                }
            },
            { new: true } // Ensure the updated conversation is returned
        );
        return updatedConversation;
    }
    const conversation = await conversationModel.create({ participants });
    return conversation;
};
