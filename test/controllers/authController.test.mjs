import * as chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import {app} from "../../src/config/socket.js";
import * as authService from "../../src/service/authService.js";
import * as jwtUtils from "../../src/utils/jwt.js";
import SessionModel from "../../src/model/session.js";
import dotenv from "dotenv";
dotenv.config();


const { expect } = chai;
chai.use(chaiHttp);

describe("Auth Controller Tests", function () {
    let createAccountStub, loginUserStub, refreshTokenStub, verifyEmailStub;

    beforeEach(() => {
        createAccountStub = sinon.stub(authService, "createAccount");
        loginUserStub = sinon.stub(authService, "loginUser");
        refreshTokenStub = sinon.stub(authService, "refreshUserAccessToken");
        verifyEmailStub = sinon.stub(authService, "verifyEmail");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should register a new user", async function () {
        createAccountStub.resolves({
            user: { id: "123", email: "test@example.com" },
            accessToken: "mockAccessToken",
            refreshToken: "mockRefreshToken",
        });

        const res = await chai.request(app)
            .post("/api/v1/v1auth/register")
            .send({ email: "test@example.com", password: "password123", username: "testuser" });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("id").that.equals("123");
    });

    it("should login a user", async function () {
        loginUserStub.resolves({
            user: { id: "123", email: "test@example.com" },
            accessToken: "mockAccessToken",
            refreshToken: "mockRefreshToken",
        });

        const res = await chai.request(app)
            .post("/api/v1/v1auth/login")
            .send({ usernameOrEmail: "test@example.com", password: "password123" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").that.equals("successfully logged in.");
    });

    it("should refresh an access token", async function () {
        refreshTokenStub.resolves({
            accessToken: "newMockAccessToken",
            newRefreshToken: "newMockRefreshToken",
        });

        const res = await chai.request(app)
            .post("/api/v1/v1auth/refresh")
            .set("Cookie", "refresh_token=mockRefreshToken");

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("access token has been refreshed.");
    });

    it("should verify an email", async function () {
        verifyEmailStub.resolves();

        const res = await chai.request(app)
            .get("/api/v1/v1auth/verify-email/mockVerificationCode");

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("email verification successful.");
    });

    it("should logout a user and clear cookies", async function () {
        sinon.stub(jwtUtils, "verifyAccessToken").returns({ payload: { sessionID: "mockSessionID" } });
        sinon.stub(SessionModel, "findByIdAndDelete").resolves();

        const res = await chai.request(app)
            .post("/api/v1/v1auth/logout")
            .set("Cookie", "access_token=mockAccessToken");

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("user logged out successfully.");
    });
});
