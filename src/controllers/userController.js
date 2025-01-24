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


export const updateUserController = catchErrors(
  async (req, res) => {
    const { username, fullname, email, image, bio} = req.body; // Fields passed in the request body
    const userId = req.userID; // Assuming userID is available from the authentication middleware

    // Find the user by their ID
    const user = await userModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    // Check if the new username is already taken
    if (username && username !== user.username) {
      const usernameExists = await userModel.findOne({ username });
      if (usernameExists) {
        return res.status(CONFLICT).json({ message: "Username is already in use." });
      }
    }

    // Check if the new email is already taken
    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(CONFLICT).json({ message: "Email is already in use." });
      }
    }

    // Only update the fields that are provided in the request body
    if (username) user.username = username;
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (image) user.image = image;
    if(bio) user.bio = bio;

    // Save the updated user object to the database
    await user.save();

    // Return a response with the updated user (excluding password)
    return res.status(OK).json({
      message: "Profile updated successfully",
      user: user.omitPassword(), // Assuming omitPassword is a method to exclude the password field
    });
  }
);
