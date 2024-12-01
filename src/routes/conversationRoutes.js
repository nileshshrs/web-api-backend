import { Router } from "express";
import { createConversationController } from "../controllers/conversationController.js";

const conversationRoutes = Router();

conversationRoutes.post("/create", createConversationController);


export default conversationRoutes;