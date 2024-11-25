import { fifteenDaysFromNow, fifteenMinutesFromNow } from "./date.js";

const refresh_path = "/auth/refresh"
const defaults = {
    sameSite: "none",
    httpOnly: true,
    secure: false, // Set to true in production
};

const getAccessTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

const getRefreshTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenDaysFromNow(),
    path: refresh_path,
});

export const setAuthCookies = (res, accessToken, refreshToken) =>
    res
        .cookie("access_token", accessToken, getAccessTokenCookieOptions())
        .cookie("refresh_token", refreshToken, getRefreshTokenCookieOptions());


export const clearAuthCookies = (res,) =>
    res
        .clearCookie("access_token")
        .clearCookie("refresh_token", {
            path: refresh_path,
        })