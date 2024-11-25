import { Router } from "express";
import {
    loginController,
    registrationController,
    logoutController,
    refreshController
} from "../controllers/authController.js";



const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)
authRoutes.get("/refresh", refreshController)

export default authRoutes