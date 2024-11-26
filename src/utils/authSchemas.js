import { z } from "zod";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const emailSchema = z.string()
    .regex(EMAIL_REGEX, "Invalid email format")
    .min(2, "Email cannot be empty")
    .max(255)

const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .max(24, "Password must be at most 24 characters")
    
export const registerSchema = z.object({
    email: emailSchema,
    username: z.string().min(4, "username cannot be empty or less than 4 characters").max(255),
    password: passwordSchema, // Optional max length for the password
    confirmpassword: z.string(),
    role: z.enum(["user", "admin"]).default("user"), // Default role set here
    userAgent: z.string().optional() // Optional user agent
}).refine(
    (data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ['confirmpassword'], // This will show the error next to the confirm password field
});

export const loginSchema = z.object({
    // Accept either a username or email
    usernameOrEmail: z.union([
        z.string().min(4, "Username cannot be empty or less than 4 characters").max(255),
        z.string().regex(EMAIL_REGEX, "Invalid email format").min(2, "Email cannot be empty")
    ]),
    password: passwordSchema, // Ensure the password is required
    userAgent: z.string().optional()
}).refine(
    (data) => data.usernameOrEmail && data.password,
    {
        message: "Username/email and password are required",
        path: ['password'],
    }
);

export const verificationCodeSchema = z.string().min(1)