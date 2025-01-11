import { Router } from "express"
import { getAllUsersController, getUserByID, userController } from "../controllers/userController.js"

const userRoutes = Router()
userRoutes.get('/profile', userController)
userRoutes.get('/all', getAllUsersController)
userRoutes.get('/:id', getUserByID)

export default userRoutes