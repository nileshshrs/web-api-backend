import catchErrors from "../utils/catchErrors.js";
import { createAccount, loginUser } from "../service/authService.js";
import { setAuthCookies } from "../utils/cookies.js";
import { CREATED, OK } from "../utils/constants/http.js";
import { loginSchema, registerSchema } from "../utils/authSchemas.js";




export const registrationController = catchErrors(
    async (req, res) => {
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers['user-agent'],
        })
        // console.log(request)
        const { user, accessToken, refreshToken } = await createAccount(request)

        return setAuthCookies(res, accessToken, refreshToken).status(CREATED).json(user);

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
            user
        });
    }
)

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