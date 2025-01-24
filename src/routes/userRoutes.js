import { Router } from "express"
import { getAllUsersController, getUserByID, updateUserController, userController } from "../controllers/userController.js"

const userRoutes = Router()
userRoutes.get('/profile', userController)
userRoutes.get('/all', getAllUsersController)
userRoutes.get('/:id', getUserByID)
userRoutes.patch('/update', updateUserController);

export default userRoutes