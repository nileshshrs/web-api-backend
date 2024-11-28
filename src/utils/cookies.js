import { fifteenDaysFromNow, fifteenMinutesFromNow } from "./date.js";

const refresh_path = "api/v1/auth/refresh"
const defaults = {
    sameSite: "none",
    httpOnly: true,
    secure: true, // Set to true in production
};

export const getAccessTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenDaysFromNow(),
    path: refresh_path,  // "/auth/refresh"
});


export const setAuthCookies = (res, accessToken, refreshToken) => {
    return res
        .cookie("access_token", accessToken, getAccessTokenCookieOptions())
        .cookie("refresh_token", refreshToken, getRefreshTokenCookieOptions());
};


export const clearAuthCookies = (res,) =>
    res
        .clearCookie("access_token")
        .clearCookie("refresh_token", {
            path: refresh_path,
        })