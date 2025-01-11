import { userModel } from "../model/user.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CONFLICT, NOT_FOUND, OK } from "../utils/constants/http.js";

export const userController = catchErrors(
    async (req, res) => {
        const user = await userModel.findById(req.userID);
        appAssert(user, NOT_FOUND, "user not found");
        return res.status(OK).json(
            user.omitPassword()
        )
    }
)


export const getAllUsersController = catchErrors(
    async (req, res) => {
        const users = await userModel.find();

        // Check if users were fetched successfully
        appAssert(users, CONFLICT, "Something went wrong while fetching users.");

        // Omit passwords from the user list
        const usersWithoutPassword = users.map(user => user.omitPassword());

        // Send the modified users as response
        return res.status(OK).json(usersWithoutPassword);
    }
);


export const getUserByID = catchErrors(
    async (req, res) => {
        const { id } = req.params;

        const user = await userModel.findById(id);

        appAssert(user, NOT_FOUND, `user with ${id} not found.`)

        return res.status(OK).json(user.omitPassword());
    }
)