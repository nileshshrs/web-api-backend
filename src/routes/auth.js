import { Router } from "express";
import { loginController, registrationController } from "../controllers/authController.js";


const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)
authRoutes.post("/sign-in", loginController) 

export default authRoutes