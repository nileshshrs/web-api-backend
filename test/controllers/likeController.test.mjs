import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../src/app.js";
import { likeModel } from "../src/model/like.js";
import { postModel } from "../src/model/posts.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Like Controller Tests", function () {
    let postFindStub, likeFindStub, likeCreateStub, likeDeleteStub, likeCountStub;

    beforeEach(() => {
        postFindStub = sinon.stub(postModel, "findById");
        likeFindStub = sinon.stub(likeModel, "findOne");
        likeCreateStub = sinon.stub(likeModel, "create");
        likeDeleteStub = sinon.stub(likeModel, "findByIdAndDelete");
        likeCountStub = sinon.stub(likeModel, "countDocuments");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should like a post successfully", async function () {
        const mockPost = { _id: "mockPostId", user: "mockUserId" };
        const mockLike = { _id: "mockLikeId", post: "mockPostId", user: "mockUserId" };

        postFindStub.resolves(mockPost);
        likeFindStub.resolves(null);
        likeCreateStub.resolves(mockLike);
        sinon.stub(likeModel, "findById").resolves({ _id: "mockLikeId", post: mockPost });

        const res = await chai.request(app)
            .post("/api/v1/likes/toggle")
            .send({ userID: "mockUserId", postID: "mockPostId" });

        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("post liked successfully.");
        expect(res.body.populatedLike).to.have.property("_id").that.equals("mockLikeId");
    });

    it("should unlike a post successfully", async function () {
        const mockPost = { _id: "mockPostId", user: "mockUserId" };
        const mockLike = { _id: "mockLikeId", post: "mockPostId", user: "mockUserId" };

        postFindStub.resolves(mockPost);
        likeFindStub.resolves(mockLike);
        likeDeleteStub.resolves(mockLike);

        const res = await chai.request(app)
            .post("/api/v1/likes/toggle")
            .send({ userID: "mockUserId", postID: "mockPostId" });

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("post unliked.");
    });

    it("should return 404 when trying to like a non-existent post", async function () {
        postFindStub.resolves(null);

        const res = await chai.request(app)
            .post("/api/v1/likes/toggle")
            .send({ userID: "mockUserId", postID: "nonExistentPostId" });

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("post not found");
    });

    it("should get post like data successfully", async function () {
        const mockPost = { _id: "mockPostId" };

        postFindStub.resolves(mockPost);
        likeCountStub.resolves(10);
        likeFindStub.resolves(null);

        const res = await chai.request(app)
            .get("/api/v1/likes/mockPostId");

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("likeCount").that.equals(10);
        expect(res.body).to.have.property("userLiked").that.equals(false);
    });

    it("should return 404 if the post does not exist when fetching like data", async function () {
        postFindStub.resolves(null);

        const res = await chai.request(app)
            .get("/api/v1/likes/nonExistentPostId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("post not found");
    });
});
