import SessionModel from "../model/session.js";
import { userModel } from "../model/user.js"
import verificationCodeModel from "../model/verificationCode.js";
import { oneDayFromNow } from "../utils/date.js";
import jwt from "jsonwebtoken"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../utils/constants/env.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT } from "../utils/constants/http.js";

export const createAccount = async (data) => {

    //verify user does not exist
    const existingUser = await userModel.exists({
        email: data.email,
    })

    appAssert(!existingUser, CONFLICT, "email already in use.")
    //create user
    const user = await userModel.create({
        email: data.email,
        username: data.username,
        password: data.password
    })
    //create verification code

    const verificationCode = await verificationCodeModel.create({
        userID: user._id,
        type: "email_verification",
        expiresAt: oneDayFromNow()
    })
    //send verification email

    //sign access and refresh token

    const session = await SessionModel.create({
        userID: user._id,
        userAgent: data.userAgent
    })
    //refresh token
    const refreshToken = jwt.sign(
        {
            sessionID: session._id
        },
        JWT_REFRESH_SECRET,
        { audience: ['user'], expiresIn: "15d" }

    )
    //access token
    const accessToken = jwt.sign(
        {
            userID: user._id,
            sessionID: session._id
        },
        JWT_SECRET,
        { audience: ['user'], expiresIn: "15m" }

    )
    //return user and tokens

    return {
        user,
        accessToken,
        refreshToken
    }

}