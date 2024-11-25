import { Router } from "express";
import { loginController, registrationController } from "../controllers/authController.js";
import { logoutController } from "../service/authService.js";


const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)

export default authRoutes