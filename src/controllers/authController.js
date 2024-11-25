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
