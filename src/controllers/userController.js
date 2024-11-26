import { userModel } from "../model/user.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { NOT_FOUND, OK } from "../utils/constants/http.js";

export const userController = catchErrors(
    async (req, res) => {
        const user = await userModel.findById(req.userID);
        appAssert(user, NOT_FOUND, "user not found");
        return res.status(OK).json(
            user.omitPassword()
        )
    }
)