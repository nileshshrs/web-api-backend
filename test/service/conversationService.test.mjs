import { expect } from "chai";
import sinon from "sinon";
import * as conversationService from "../src/service/conversationService.js";
import { conversationModel } from "../src/model/conversation.js";

describe("Conversation Service Tests", function () {
    let findOneStub, createStub, updateStub, deleteStub;

    beforeEach(() => {
        findOneStub = sinon.stub(conversationModel, "findOne");
        createStub = sinon.stub(conversationModel, "create");
        updateStub = sinon.stub(conversationModel, "findOneAndUpdate");
        deleteStub = sinon.stub(conversationModel, "deleteOne");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create a new conversation if it does not exist", async function () {
        findOneStub.resolves(null);

        createStub.resolves({ _id: "mockConversationId", participants: ["user1", "user2"] });

        const result = await conversationService.createConversation(["user1", "user2"], "user1");

        expect(result).to.have.property("_id").that.equals("mockConversationId");
    });

    it("should return an existing conversation", async function () {
        findOneStub.resolves({ _id: "mockConversationId", participants: ["user1", "user2"] });

        const result = await conversationService.createConversation(["user1", "user2"], "user1");

        expect(result).to.have.property("_id").that.equals("mockConversationId");
    });

    it("should update a conversation successfully", async function () {
        findOneStub.resolves({ _id: "mockConversationId", participants: ["user1", "user2"] });

        updateStub.resolves({ _id: "mockConversationId", title: "Updated Chat" });

        const result = await conversationService.updateConversation("user1", "mockConversationId");

        expect(result).to.have.property("title").that.equals("Updated Chat");
    });

    it("should return null if conversation not found", async function () {
        findOneStub.resolves(null);

        try {
            await conversationService.updateConversation("user1", "mockConversationId");
        } catch (error) {
            expect(error.message).to.equal("conversation not found.");
        }
    });

    it("should delete a conversation if only one participant remains", async function () {
        findOneStub.resolves({ _id: "mockConversationId", participants: ["user1"] });

        deleteStub.resolves({ acknowledged: true });

        const result = await conversationService.updateConversation("user1", "mockConversationId");

        expect(result).to.be.undefined;
    });
});
