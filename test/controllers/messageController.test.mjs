import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../src/app.js";
import { messageModel } from "../src/model/message.js";
import * as messageService from "../src/service/messageService.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Message Controller Tests", function () {
    let createStub, findByIdStub, findStub;

    beforeEach(() => {
        createStub = sinon.stub(messageService, "createMessage");
        findByIdStub = sinon.stub(messageModel, "findById");
        findStub = sinon.stub(messageModel, "find");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create a message successfully", async function () {
        const mockMessage = {
            _id: "mockMessageId",
            sender: "mockUserId",
            conversation: "mockConversationId",
            content: "Hello, this is a test message",
        };

        createStub.resolves(mockMessage);
        findByIdStub.resolves({
            _id: "mockMessageId",
            sender: { username: "user1", image: "user1.jpg" },
            recipient: { username: "user2", image: "user2.jpg" },
            conversation: "mockConversationId",
            content: "Hello, this is a test message",
        });

        const res = await chai.request(app)
            .post("/api/v1/messages/mockConversationId")
            .set("Authorization", "Bearer mockToken")
            .send({ content: "Hello, this is a test message" });

        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("message created successfully");
        expect(res.body.newMessage).to.have.property("content").that.equals("Hello, this is a test message");
    });

    it("should retrieve messages for a conversation", async function () {
        const mockMessages = [
            {
                _id: "msg1",
                sender: { username: "user1", image: "user1.jpg" },
                recipient: { username: "user2", image: "user2.jpg" },
                content: "Hello!",
            },
            {
                _id: "msg2",
                sender: { username: "user2", image: "user2.jpg" },
                recipient: { username: "user1", image: "user1.jpg" },
                content: "Hi there!",
            },
        ];

        findStub.resolves(mockMessages);

        const res = await chai.request(app)
            .get("/api/v1/messages/mockConversationId");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);
        expect(res.body[0]).to.have.property("content").that.equals("Hello!");
    });

    it("should return an empty array if no messages are found", async function () {
        findStub.resolves([]);

        const res = await chai.request(app)
            .get("/api/v1/messages/mockConversationId");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.is.empty;
    });
});
