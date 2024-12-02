import { Router } from "express";
import { createConversationController, getConversationController } from "../controllers/conversationController.js";
import { conversationModel } from "../model/conversation.js";
import authenticate from "../middleware/authenticate.js";

const conversationRoutes = Router();

conversationRoutes.post("/create", createConversationController);
//pass in the middleware to validate the the user then i wont have to pass the user id as a param everytime as userID 
//is stored in cookie iteself
conversationRoutes.get("/get", authenticate, getConversationController);
//pass in the middleware to validate the the user then i wont have to pass the user id as a param everytime as userID 
//is stored in cookie iteself



export default conversationRoutes;