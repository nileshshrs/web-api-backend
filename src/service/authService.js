import { userModel } from "../model/user.js"

export const createAccount = async (data) => {
    const existingUser = await userModel.exists({
        email: data.email,
    })

    if (existingUser) {
        throw new Error("the email is already registered.");
    }
    const user = await userModel.create({
        email: data.email,
        username: data.username,
        password: data.password
    })

    return user

}