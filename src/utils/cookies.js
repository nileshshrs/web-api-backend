import { fifteenDaysFromNow, fifteenMinutesFromNow } from "./date.js";

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
    path: "/auth/refresh",
});

export const setAuthCookies = (res, accessToken, refreshToken) =>
    res
        .cookie("access_token", accessToken, getAccessTokenCookieOptions())
        .cookie("refresh_token", refreshToken, getRefreshTokenCookieOptions());


