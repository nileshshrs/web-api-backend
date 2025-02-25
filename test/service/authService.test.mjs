import { expect } from "chai";
import sinon from "sinon";
import * as authService from "../src/service/authService.js";
import userModel from "../src/model/user.js";
import SessionModel from "../src/model/session.js";
import verificationCodeModel from "../src/model/verificationCode.js";
import { signTokens, verifyToken } from "../src/utils/jwt.js";
import { hash } from "../src/utils/bcrypt.js";

describe("Auth Service Tests", function () {
    let userStub, sessionStub, tokenStub, verificationCodeStub;

    beforeEach(() => {
        userStub = sinon.stub(userModel, "findOne");
        sessionStub = sinon.stub(SessionModel, "create");
        tokenStub = sinon.stub(verifyToken);
        verificationCodeStub = sinon.stub(verificationCodeModel, "findOne");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create an account and return tokens", async function () {
        userStub.resolves(null); // No existing user

        const userCreateStub = sinon.stub(userModel, "create").resolves({
            _id: "mockUserId",
            email: "test@example.com",
            omitPassword: () => ({ _id: "mockUserId", email: "test@example.com" }),
        });

        sessionStub.resolves({ _id: "mockSessionId" });

        const signTokenStub = sinon.stub(signTokens);
        signTokenStub.onFirstCall().returns("mockRefreshToken");
        signTokenStub.onSecondCall().returns("mockAccessToken");

        const result = await authService.createAccount({
            email: "test@example.com",
            username: "testuser",
            password: "password123",
            userAgent: "Mozilla",
        });

        expect(result).to.have.property("user").that.deep.equals({ _id: "mockUserId", email: "test@example.com" });
        expect(result).to.have.property("accessToken").that.equals("mockAccessToken");
        expect(result).to.have.property("refreshToken").that.equals("mockRefreshToken");
    });

    it("should login a user and return tokens", async function () {
        const mockUser = {
            _id: "mockUserId",
            email: "test@example.com",
            comparePassword: sinon.stub().returns(true),
            omitPassword: () => ({ _id: "mockUserId", email: "test@example.com" }),
        };

        userStub.resolves(mockUser);
        sessionStub.resolves({ _id: "mockSessionId" });

        const signTokenStub = sinon.stub(signTokens);
        signTokenStub.onFirstCall().returns("mockRefreshToken");
        signTokenStub.onSecondCall().returns("mockAccessToken");

        const result = await authService.loginUser({
            usernameOrEmail: "test@example.com",
            password: "password123",
            userAgent: "Mozilla",
        });

        expect(result).to.have.property("user").that.deep.equals({ _id: "mockUserId", email: "test@example.com" });
        expect(result).to.have.property("accessToken").that.equals("mockAccessToken");
        expect(result).to.have.property("refreshToken").that.equals("mockRefreshToken");
    });

    it("should refresh an access token", async function () {
        const mockSession = { _id: "mockSessionId", expiresAt: new Date(Date.now() + 1000000) };

        tokenStub.returns({ payload: { sessionID: "mockSessionId" } });
        sinon.stub(SessionModel, "findById").resolves(mockSession);

        const signTokenStub = sinon.stub(signTokens);
        signTokenStub.onFirstCall().returns("mockNewAccessToken");
        signTokenStub.onSecondCall().returns("mockNewRefreshToken");

        const result = await authService.refreshUserAccessToken("mockRefreshToken");

        expect(result).to.have.property("accessToken").that.equals("mockNewAccessToken");
        expect(result).to.have.property("newRefreshToken").that.equals("mockNewRefreshToken");
    });

    it("should verify email and update user", async function () {
        verificationCodeStub.resolves({
            _id: "mockCode",
            userID: "mockUserId",
            type: "email_verification",
            expiresAt: new Date(Date.now() + 10000),
        });

        const updateStub = sinon.stub(userModel, "findByIdAndUpdate").resolves({
            _id: "mockUserId",
            verified: true,
            omitPassword: () => ({ _id: "mockUserId", verified: true }),
        });

        const result = await authService.verifyEmail("mockCode");

        expect(result).to.have.property("user").that.deep.equals({ _id: "mockUserId", verified: true });
        expect(updateStub.calledOnce).to.be.true;
    });
});
