import { Router } from "express"
import { userController } from "../controllers/userController.js"

const userRoutes = Router()
userRoutes.get('/get', userController)

export default userRoutes