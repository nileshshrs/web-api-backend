import SessionModel from "../model/session.js";
import { userModel } from "../model/user.js";
import verificationCodeModel from "../model/verificationCode.js";
import { fifteenDaysFromNow, oneDayFromNow } from "../utils/date.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../utils/constants/http.js";
import { signTokens, refreshTokenSignOptions, accessTokenSignOptions, verifyToken } from "../utils/jwt.js";
import { APP_ORIGIN, JWT_REFRESH_SECRET } from "../utils/constants/env.js";
import { sendMail } from "../utils/sendMail.js";
import { getVerifyEmailTemplate } from "../utils/emailtemplate.js";

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
    //send verification email
    const url = `${APP_ORIGIN}/email-verification/${verificationCode._id}`
    const { error } = await sendMail({
        to: user.email,
        ...getVerifyEmailTemplate(url)
    })

    if (error) console.log(error)


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

export const refreshUserAccessToken = async (refreshToken) => {
    console.log(refreshTokenSignOptions.secret)
    const { payload } = verifyToken(refreshToken)


    appAssert(payload, UNAUTHORIZED, "invalid refresh token.")

    const session = await SessionModel.findById(payload.sessionID)
    const now = Date.now()
    appAssert(session
        && session.expiresAt.getTime() > now
        , UNAUTHORIZED, "session has expired.")

    // refresh session if it expires within next 24hrs

    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= oneDayFromNow;

    if (sessionNeedsRefresh) {
        session.expiresAt = fifteenDaysFromNow();
        await session.save()
    }
    const newRefreshToken = sessionNeedsRefresh ? signTokens({
        sessionID: session._id, refreshTokenSignOptions
    }) : ""


    const accessToken = signTokens({
        userID: session.userID,
        sessionID: session._id
    })

    return {
        accessToken, newRefreshToken
    }

}

export const verifyEmail = async (code) => {
    //get the verificationc code

    const validCode = await verificationCodeModel.findOne({
        _id: code,
        type: "email_verification",
        expiresAt: { $gt: new Date() },
    })

    console.log(validCode)
    appAssert(validCode, NOT_FOUND, "invalid or expired verification code.");



    //get user by id & update user to verified = true
    const updatedUser = await userModel.findByIdAndUpdate(
        validCode.userID, // The user's ID from the verification code
        { verified: true }, // Update the 'verified' field to true
        { new: true } // Ensure that the updated document is returned
    );
    console.log("updated user: ", updatedUser)



    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "failed to verify user.")
    //delete verification code
    await validCode.deleteOne()


    return {
        user: updatedUser.omitPassword()
    }
}

