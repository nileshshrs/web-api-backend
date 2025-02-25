import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../src/app.js";
import { userModel } from "../src/model/user.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("User Controller Tests", function () {
    let userFindByIdStub, userFindStub, userFindOneStub, userSaveStub;

    beforeEach(() => {
        userFindByIdStub = sinon.stub(userModel, "findById");
        userFindStub = sinon.stub(userModel, "find");
        userFindOneStub = sinon.stub(userModel, "findOne");
        userSaveStub = sinon.stub(userModel.prototype, "save"); // Stub instance method
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should get the authenticated user's data", async function () {
        const mockUser = { _id: "mockUserId", username: "testUser", omitPassword: () => ({ _id: "mockUserId", username: "testUser" }) };

        userFindByIdStub.resolves(mockUser);

        const res = await chai.request(app)
            .get("/api/v1/user")
            .set("Authorization", "Bearer mockToken");

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("username").that.equals("testUser");
    });

    it("should return 404 when the authenticated user is not found", async function () {
        userFindByIdStub.resolves(null);

        const res = await chai.request(app)
            .get("/api/v1/user")
            .set("Authorization", "Bearer mockToken");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("user not found");
    });

    it("should get all users successfully", async function () {
        const mockUsers = [
            { _id: "user1", username: "user1", omitPassword: () => ({ _id: "user1", username: "user1" }) },
            { _id: "user2", username: "user2", omitPassword: () => ({ _id: "user2", username: "user2" }) },
        ];

        userFindStub.resolves(mockUsers);

        const res = await chai.request(app)
            .get("/api/v1/users");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);
        expect(res.body[0]).to.have.property("username").that.equals("user1");
    });

    it("should return 404 when no users are found", async function () {
        userFindStub.resolves([]);

        const res = await chai.request(app)
            .get("/api/v1/users");

        expect(res).to.have.status(409);
        expect(res.body.message).to.equal("Something went wrong while fetching users.");
    });

    it("should get a user by ID", async function () {
        const mockUser = { _id: "mockUserId", username: "testUser", omitPassword: () => ({ _id: "mockUserId", username: "testUser" }) };

        userFindByIdStub.resolves(mockUser);

        const res = await chai.request(app)
            .get("/api/v1/user/mockUserId");

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("username").that.equals("testUser");
    });

    it("should return 404 when a user by ID is not found", async function () {
        userFindByIdStub.resolves(null);

        const res = await chai.request(app)
            .get("/api/v1/user/nonExistentUserId");

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("user with nonExistentUserId not found.");
    });

    it("should update a user profile successfully", async function () {
        const mockUser = {
            _id: "mockUserId",
            username: "testUser",
            email: "test@example.com",
            omitPassword: () => ({ _id: "mockUserId", username: "updatedUser", email: "updated@example.com" })
        };

        userFindByIdStub.resolves(mockUser);
        userFindOneStub.resolves(null);
        userSaveStub.resolves(mockUser);

        const res = await chai.request(app)
            .patch("/api/v1/user")
            .set("Authorization", "Bearer mockToken")
            .send({ username: "updatedUser", email: "updated@example.com" });

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Profile updated successfully");
        expect(res.body.user).to.have.property("username").that.equals("updatedUser");
    });

    it("should return 409 when updating with an already taken username", async function () {
        const mockUser = { _id: "mockUserId", username: "testUser", email: "test@example.com" };
        const existingUser = { _id: "anotherUserId", username: "existingUser" };

        userFindByIdStub.resolves(mockUser);
        userFindOneStub.resolves(existingUser);

        const res = await chai.request(app)
            .patch("/api/v1/user")
            .set("Authorization", "Bearer mockToken")
            .send({ username: "existingUser" });

        expect(res).to.have.status(409);
        expect(res.body.message).to.equal("Username is already in use.");
    });

    it("should return 409 when updating with an already taken email", async function () {
        const mockUser = { _id: "mockUserId", username: "testUser", email: "test@example.com" };
        const existingEmailUser = { _id: "anotherUserId", email: "existing@example.com" };

        userFindByIdStub.resolves(mockUser);
        userFindOneStub.onFirstCall().resolves(null); // First call checks username
        userFindOneStub.onSecondCall().resolves(existingEmailUser); // Second call checks email

        const res = await chai.request(app)
            .patch("/api/v1/user")
            .set("Authorization", "Bearer mockToken")
            .send({ email: "existing@example.com" });

        expect(res).to.have.status(409);
        expect(res.body.message).to.equal("Email is already in use.");
    });

    it("should return 404 when updating a non-existent user", async function () {
        userFindByIdStub.resolves(null);

        const res = await chai.request(app)
            .patch("/api/v1/user")
            .set("Authorization", "Bearer mockToken")
            .send({ username: "updatedUser" });

        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("User not found");
    });
});
