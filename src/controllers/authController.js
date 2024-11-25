import { z } from "zod";
import catchErrors from "../utils/catchErrors.js";
import { createAccount } from "../service/authService.js";
import { setAuthCookies } from "../utils/cookies.js";
import { CREATED } from "../utils/constants/http.js";


const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const registerSchema = z.object({
    email: z.string()
        .regex(EMAIL_REGEX, "Invalid email format") // Use the regex for email validation
        .min(2, "Email cannot be empty") // Ensure the email is not empty
        .max(255), // Optional max length for the email
    username: z.string().min(4, "username cannot be empty or less than 4 characters").max(255),
    password: z.string()
        .min(8, "Password must be at least 8 characters") // Password length check
        .max(24, "Password must be at most 24 characters"), // Optional max length for the password
    confirmpassword: z.string(),
    role: z.enum(["user", "admin"]).default("user"), // Default role set here
    userAgent: z.string().optional() // Optional user agent
}).refine(
    (data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ['confirmpassword'], // This will show the error next to the confirm password field
});

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
