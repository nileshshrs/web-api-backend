import { Router } from "express";
import {
    loginController,
    registrationController,
    logoutController,
    refreshController,
    verifyEmailController
} from "../controllers/authController.js";



const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)
authRoutes.get("/refresh", refreshController)
authRoutes.get("/verify-email/:code", verifyEmailController)

export default authRoutes