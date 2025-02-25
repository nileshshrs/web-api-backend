import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../src/app.js";
import { conversationModel } from "../src/model/conversation.js";
import * as conversationService from "../src/service/conversationService.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Conversation Controller Tests", function () {
    let createStub, findStub, findByIdStub, updateStub, deleteStub;

    beforeEach(() => {
        createStub = sinon.stub(conversationService, "createConversation");
        findStub = sinon.stub(conversationModel, "find");
        findByIdStub = sinon.stub(conversationModel, "findById");
        updateStub = sinon.stub(conversationModel, "findOneAndUpdate");
        deleteStub = sinon.stub(conversationModel, "deleteOne");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create a conversation successfully", async function () {
        const mockConversation = {
            _id: "mockConversationId",
            participants: ["user1", "user2"],
        };

        createStub.resolves(mockConversation);

        const res = await chai.request(app)
            .post("/api/v1/conversations")
            .set("Authorization", "Bearer mockToken")
            .send({ participants: ["user1", "user2"] });

        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("conversation created successfully");
        expect(res.body.conversation).to.have.property("_id").that.equals("mockConversationId");
    });

    it("should retrieve conversations for a user", async function () {
        const mockConversations = [
            { _id: "conv1", participants: ["user1", "user2"], title: "Test Chat" },
            { _id: "conv2", participants: ["user1", "user3"], title: "Another Chat" }
        ];

        findStub.resolves(mockConversations);

        const res = await chai.request(app)
            .get("/api/v1/conversations");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);
        expect(res.body[0]).to.have.property("title").that.equals("Test Chat");
    });

    it("should return 404 if no conversations are found", async function () {
        findStub.resolves([]);

        const res = await chai.request(app)
            .get("/api/v1/conversations");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("conversation not found.");
    });

    it("should update a conversation successfully", async function () {
        updateStub.resolves({ _id: "mockConversationId", title: "Updated Chat" });

        const res = await chai.request(app)
            .patch("/api/v1/conversations/mockConversationId");

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Conversation deleted successfully.");
        expect(res.body.conversation).to.have.property("title").that.equals("Updated Chat");
    });

    it("should return 404 if the conversation to update is not found", async function () {
        updateStub.resolves(null);

        const res = await chai.request(app)
            .patch("/api/v1/conversations/mockConversationId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("conversation not found.");
    });

    it("should retrieve a conversation by ID", async function () {
        const mockConversation = {
            _id: "mockConversationId",
            participants: ["user1", "user2"],
            title: "Chat Test"
        };

        findByIdStub.resolves(mockConversation);

        const res = await chai.request(app)
            .get("/api/v1/conversations/mockConversationId");

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title").that.equals("Chat Test");
    });

    it("should return 404 if the conversation ID does not exist", async function () {
        findByIdStub.resolves(null);

        const res = await chai.request(app)
            .get("/api/v1/conversations/mockConversationId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("conversation with id: mockConversationId does not exist.");
    });

    it("should mark a conversation as unread successfully", async function () {
        updateStub.resolves({ _id: "mockConversationId", read: null });

        const res = await chai.request(app)
            .patch("/api/v1/conversations/mockConversationId/unread");

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Conversation marked as unread successfully.");
    });

    it("should return 404 if marking unread conversation fails", async function () {
        updateStub.resolves(null);

        const res = await chai.request(app)
            .patch("/api/v1/conversations/mockConversationId/unread");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("conversation with id: mockConversationId does not exist.");
    });
});
