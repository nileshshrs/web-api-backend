import { Router } from "express";
import { loginController, registrationController, logoutController } from "../controllers/authController.js";



const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)

export default authRoutes