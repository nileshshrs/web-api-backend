import { Router } from "express";
import { registrationController } from "../controllers/authController.js";


const authRoutes = Router();


authRoutes.post("/sign-up", registrationController)

export default authRoutes