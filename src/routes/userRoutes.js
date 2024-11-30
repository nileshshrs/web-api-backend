import { Router } from "express"
import { userController } from "../controllers/userController.js"

const userRoutes = Router()
userRoutes.get('/profile', userController)

export default userRoutes