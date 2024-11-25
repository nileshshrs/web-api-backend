import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "./constants/env.js";


const defaults = {
    audience: ['user'],
};
// jwt.js
export const refreshTokenSignOptions = {
    expiresIn: "15d",
    secret: JWT_REFRESH_SECRET,
};

export const accessTokenSignOptions = {
    expiresIn: "15m",
    secret: JWT_SECRET,
};

// Keep the signTokens function as well
export const signTokens = (payload, options) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions;

    return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};


export const verifyToken = (token, options) => {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};
    try {
        const payload = jwt.verify(token, secret, { ...defaults, ...verifyOpts })
        return { payload }
    } catch (err) {
        return {
            error: err.message
        }
    }
}