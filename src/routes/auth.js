import { Router } from "express";
import {
    loginController,
    registrationController,
    logoutController,
    refreshController,
    verifyEmailController,
    sendPasswordResetController
} from "../controllers/authController.js";



const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)
authRoutes.get("/refresh", refreshController)
authRoutes.get("/verify-email/:code", verifyEmailController)
authRoutes.post("/account-recovery", sendPasswordResetController)

export default authRoutes