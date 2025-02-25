import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../src/app.js";
import { commentModel } from "../src/model/comment.js";
import * as commentController from "../src/controllers/commentController.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Comment Controller Tests", function () {
    let createStub, findStub, deleteStub;

    beforeEach(() => {
        createStub = sinon.stub(commentModel, "create");
        findStub = sinon.stub(commentModel, "find");
        deleteStub = sinon.stub(commentModel, "findByIdAndDelete");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create a comment successfully", async function () {
        const mockComment = {
            _id: "mockCommentId",
            user: "mockUserId",
            post: "mockPostId",
            comment: "This is a test comment.",
            populate: sinon.stub().resolves({ _id: "mockCommentId", user: { username: "testUser", image: "user.jpg" }, post: "mockPostId", comment: "This is a test comment." }),
        };

        createStub.resolves(mockComment);

        const res = await chai.request(app)
            .post("/api/v1/comments")
            .set("Authorization", "Bearer mockToken")
            .send({ post: "mockPostId", comment: "This is a test comment." });

        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("comment created successfully.");
        expect(res.body.newComment).to.have.property("comment").that.equals("This is a test comment.");
    });

    it("should retrieve comments for a given post", async function () {
        const mockComments = [
            { _id: "comment1", user: { username: "user1", image: "img1.jpg" }, post: "mockPostId", comment: "First comment." },
            { _id: "comment2", user: { username: "user2", image: "img2.jpg" }, post: "mockPostId", comment: "Second comment." },
        ];

        findStub.resolves(mockComments);

        const res = await chai.request(app)
            .get("/api/v1/comments/mockPostId");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);
        expect(res.body[0]).to.have.property("comment").that.equals("First comment.");
    });

    it("should return 404 if no comments are found for a post", async function () {
        findStub.resolves([]);

        const res = await chai.request(app)
            .get("/api/v1/comments/mockPostId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("comments for post with id mockPostId not found.");
    });

    it("should delete a comment successfully", async function () {
        deleteStub.resolves({ _id: "mockCommentId", comment: "This comment will be deleted." });

        const res = await chai.request(app)
            .delete("/api/v1/comments/mockCommentId");

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("comment deleted successfully.");
    });

    it("should return 404 if the comment to delete is not found", async function () {
        deleteStub.resolves(null);

        const res = await chai.request(app)
            .delete("/api/v1/comments/mockCommentId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("comment not found");
    });
});
