import catchErrors from "../utils/catchErrors.js";
import { createAccount, loginUser, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from "../service/authService.js";
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies.js";
import { CREATED, OK, UNAUTHORIZED } from "../utils/constants/http.js";
import { loginSchema, registerSchema, verificationCodeSchema, emailSchema, resetPasswordSchema } from "../utils/authSchemas.js";
import appAssert from "../utils/appAssert.js";
import { verifyAccessToken, verifyToken } from "../utils/jwt.js";
import { clearAuthCookies } from "../utils/cookies.js";
import SessionModel from "../model/session.js";



export const registrationController = catchErrors(
    async (req, res) => {
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers['user-agent'],
        })
        // console.log(request)
        const { user, accessToken, refreshToken } = await createAccount(request)

        return setAuthCookies(res, accessToken, refreshToken).status(CREATED).json(user, accessToken, refreshToken);

    }
)

export const loginController = catchErrors(
    async (req, res) => {
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers['user-agent'],
        })

        const { user, accessToken, refreshToken } = await loginUser(request)
        return setAuthCookies(res, accessToken, refreshToken).status(OK).json({
            message: "successfully logged in.",
            user,
        });
    }
)

export const loginMobileController = catchErrors(
    async (req, res) => {
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers['user-agent'],
        })

        const { user, accessToken, refreshToken } = await loginUser(request)
        return setAuthCookies(res, accessToken, refreshToken).status(OK).json({
            message: "successfully logged in.",
            user,
            accessToken,
            refreshToken
        });
    }
)

export const logoutController = catchErrors(
    async (req, res) => {


        const accessToken = req.cookies.access_token
        const { payload } = verifyAccessToken(accessToken || "")


        if (payload) {
            await SessionModel.findByIdAndDelete(payload.sessionID)
        }

        return clearAuthCookies(res).status(OK).json({
            message: "user logged out successfully."
        })

    }
)

export const refreshController = catchErrors(
    async (req, res) => {
        const refreshToken = req.cookies.refresh_token

        appAssert(refreshToken, UNAUTHORIZED, "missing refresh token.");


        const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken)
        if (newRefreshToken) res.cookie('refresh_token', newRefreshToken, getRefreshTokenCookieOptions())
        return res.status(OK).cookie('access_token', accessToken, getAccessTokenCookieOptions()).json({
            message: "access token has been refreshed."
        })
    }

)
export const refreshMobileController = catchErrors(
    async (req, res) => {
        // Extract refresh token from Authorization header
        const authorizationHeader = req.headers.authorization || '';
        const refreshToken = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.split(' ')[1] : undefined;

        appAssert(refreshToken, UNAUTHORIZED, "missing refresh token.");

        const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

        return res.status(OK).json({
            message: "access token has been refreshed.",
            accessToken: accessToken,
            refreshToken: newRefreshToken || refreshToken,
        });
    }
);


export const verifyEmailController = catchErrors(
    async (req, res) => {

        const verificationCode = verificationCodeSchema.parse(req.params.code);
        await verifyEmail(verificationCode);

        return res.status(OK).json({
            message: "email verification successful."
        })
    }
)

export const sendPasswordResetController = catchErrors(
    async (req, res) => {
        const parsedEmail = emailSchema.parse(req.body.email); // Ensure email validation


        // Call the service function to handle the logic of sending the reset email
        const { url, emailId } = await sendPasswordResetEmail(parsedEmail);

        // Respond with success message
        res.status(200).json({
            message: "Password reset email sent.",
            resetUrl: url, // Optionally, return the URL as well in the response.
            emailId
        });
    }
);

export const resetPasswordController = catchErrors(
    async (req, res) => {
        const request = resetPasswordSchema.parse(req.body)
        await resetPassword(request)

        return clearAuthCookies(res).status(OK).json({
            message: "password reset succesful."
        })
    }
)

