import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../src/app.js";
import { postModel } from "../src/model/posts.js";
import { followModel } from "../src/model/follow.js";
import * as postService from "../src/service/postService.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Post Controller Tests", function () {
    let postCreateStub, postFindStub, followFindStub, postServiceStub;

    beforeEach(() => {
        postCreateStub = sinon.stub(postModel, "create");
        postFindStub = sinon.stub(postModel, "find");
        followFindStub = sinon.stub(followModel, "find");
        postServiceStub = sinon.stub(postService, "getPostsService");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create a post successfully", async function () {
        const mockPost = { _id: "mockPostId", user: "mockUserId", content: "Hello, world!" };

        postCreateStub.resolves(mockPost);

        const res = await chai.request(app)
            .post("/api/v1/posts")
            .set("Authorization", "Bearer mockToken")
            .send({ content: "Hello, world!" });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("content").that.equals("Hello, world!");
    });

    it("should get all posts for a user and their followers", async function () {
        const mockPosts = [
            { _id: "post1", user: "user1", content: "Post from user1" },
            { _id: "post2", user: "user2", content: "Post from user2" },
        ];

        postServiceStub.resolves(mockPosts);

        const res = await chai.request(app)
            .get("/api/v1/posts")
            .query({ page: 1, limit: 5 });

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);
        expect(res.body[0]).to.have.property("content").that.equals("Post from user1");
    });

    it("should get all posts for a user on mobile", async function () {
        const mockPosts = [
            { _id: "post1", user: { username: "user1", image: "user1.jpg" }, content: "User1 post" },
            { _id: "post2", user: { username: "user2", image: "user2.jpg" }, content: "User2 post" },
        ];

        followFindStub.resolves([{ following: "user1" }]);
        postFindStub.resolves(mockPosts);

        const res = await chai.request(app)
            .get("/api/v1/posts/mobile")
            .set("Authorization", "Bearer mockToken");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);
        expect(res.body[0].user).to.have.property("username").that.equals("user1");
    });

    it("should get posts by a specific user", async function () {
        const mockPosts = [{ _id: "post1", user: "mockUserId", content: "User's post" }];

        postFindStub.resolves(mockPosts);

        const res = await chai.request(app)
            .get("/api/v1/posts/user")
            .set("Authorization", "Bearer mockToken");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(1);
        expect(res.body[0]).to.have.property("content").that.equals("User's post");
    });

    it("should return 404 if no posts are found for a user", async function () {
        postFindStub.resolves([]);

        const res = await chai.request(app)
            .get("/api/v1/posts/user")
            .set("Authorization", "Bearer mockToken");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("posts from user with mockUserId not found.");
    });

    it("should get posts by user ID", async function () {
        const mockPosts = [{ _id: "post1", user: "mockUserId", content: "User's post" }];

        postFindStub.resolves(mockPosts);

        const res = await chai.request(app)
            .get("/api/v1/posts/user/mockUserId");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(1);
        expect(res.body[0]).to.have.property("content").that.equals("User's post");
    });

    it("should return 404 if no posts are found for the given user ID", async function () {
        postFindStub.resolves([]);

        const res = await chai.request(app)
            .get("/api/v1/posts/user/mockUserId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("posts from user with mockUserId not found.");
    });

    it("should get a post by ID", async function () {
        const mockPost = { _id: "mockPostId", user: { username: "user1", image: "user1.jpg" }, content: "Post content" };

        sinon.stub(postModel, "findById").resolves(mockPost);

        const res = await chai.request(app)
            .get("/api/v1/posts/mockPostId");

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("content").that.equals("Post content");
    });

    it("should return 404 if the post by ID is not found", async function () {
        sinon.stub(postModel, "findById").resolves(null);

        const res = await chai.request(app)
            .get("/api/v1/posts/nonExistentPostId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("Post with ID nonExistentPostId not found.");
    });
});
