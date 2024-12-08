import appAssert from "../utils/appAssert.js";
import { AppErrorCode } from "../utils/AppError.js";
import { UNAUTHORIZED } from "../utils/constants/http.js";
import { verifyAccessToken } from "../utils/jwt.js";


const authenticate = (req, res, next) => {

    const accessToken = req.cookies.access_token || undefined;
    appAssert(accessToken, UNAUTHORIZED, "not authorized.", AppErrorCode.InvalidAccessToken);

    const { error, payload } = verifyAccessToken(accessToken);

    appAssert(payload, error === 'jwt expired' ? "Token Expired." : "Invalid token.", AppErrorCode.InvalidAccessToken);

    req.userID = payload.userID;
    req.sessionID = payload.sessionID;
    next()

}

export default authenticate;

//this is for access token to be used with cookie as well as from authorization header need to think about how to implement it
// according to mobile application

// const authenticate = (req, res, next) => {

//     // Old code
//     const accessToken = req.cookies.access_token || undefined; 
    
//     // Added part: Check Authorization header for access token if not found in cookies
//     const authorizationHeader = req.headers.authorization || '';
//     const tokenFromHeader = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.split(' ')[1] : undefined;
    
//     // If no token in cookies, use the token from Authorization header
//     const accessTokenToUse = accessToken || tokenFromHeader;

//     appAssert(accessTokenToUse, UNAUTHORIZED, "not authorized.", AppErrorCode.InvalidAccessToken);

//     const { error, payload } = verifyAccessToken(accessTokenToUse);

//     appAssert(payload, error === 'jwt expired' ? "Token Expired." : "Invalid token.", AppErrorCode.InvalidAccessToken);

//     req.userID = payload.userID;
//     req.sessionID = payload.sessionID;
//     next()

// }
