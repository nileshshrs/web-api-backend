import SessionModel from "../model/session.js";
import { userModel } from "../model/user.js";
import verificationCodeModel from "../model/verificationCode.js";
import { oneDayFromNow } from "../utils/date.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT, OK, UNAUTHORIZED } from "../utils/constants/http.js";
import { signTokens, refreshTokenSignOptions, accessTokenSignOptions, verifyToken } from "../utils/jwt.js";
import catchErrors from "../utils/catchErrors.js";
import { clearAuthCookies } from "../utils/cookies.js";

export const createAccount = async (data) => {
    // Verify user does not exist
    const existingUser = await userModel.exists({
        email: data.email,
    });

    appAssert(!existingUser, CONFLICT, "Email already in use.");

    // Create user
    const user = await userModel.create({
        email: data.email,
        username: data.username,
        password: data.password,
    });

    // Create verification code
    const verificationCode = await verificationCodeModel.create({
        userID: user._id,
        type: "email_verification",
        expiresAt: oneDayFromNow(),
    });

    // Create session
    const session = await SessionModel.create({
        userID: user._id,
        userAgent: data.userAgent,
    });

    // Sign refresh token
    const refreshToken = signTokens(
        { sessionID: session._id },
        refreshTokenSignOptions
    );

    // Sign access token
    const accessToken = signTokens(
        { userID: user._id, sessionID: session._id },
        accessTokenSignOptions
    );

    // Return user and tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};

export const loginUser = async ({ usernameOrEmail, password, userAgent }) => {
    // Get user by username or email
    const user = await userModel.findOne({
        $or: [
            { username: usernameOrEmail },
            { email: usernameOrEmail },
        ],
    });

    appAssert(user, UNAUTHORIZED, "Invalid credentials. Please try again.");

    // Validate password from request
    const isValid = user.comparePassword(password);
    appAssert(isValid, UNAUTHORIZED, "Invalid credentials. Please try again.");

    const userID = user._id;

    // Create session
    const session = await SessionModel.create({
        userID,
        userAgent,
    });

    const sessionInfo = {
        sessionID: session._id,
    };

    // Sign refresh token
    const refreshToken = signTokens(sessionInfo, refreshTokenSignOptions);

    // Sign access token
    const accessToken = signTokens(
        { ...sessionInfo, userID: user._id },
        accessTokenSignOptions
    );

    // Return user and tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};

export const logoutController = catchErrors(
    async (req, res) => {

        const accessToken = req.cookies.access_token
        const refreshToken = req.cookies.refresh_token

        const { payload } = verifyToken(accessToken)

        if (payload) {
            await SessionModel.findByIdAndDelete(payload.sessionID)
        }

        return clearAuthCookies(res).status(OK).json({
            message: "user logged out successfully"
        })

    }
)