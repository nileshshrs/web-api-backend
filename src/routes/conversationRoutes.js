import { Router } from "express";
import { createConversationController, getConversationByIDController, getConversationController, updateConversationController } from "../controllers/conversationController.js";
import authenticate from "../middleware/authenticate.js";

const conversationRoutes = Router();

conversationRoutes.post("/create", authenticate, createConversationController);
//pass in the middleware to validate the the user then i wont have to pass the user id as a param everytime as userID 
//is stored in cookie iteself
conversationRoutes.get("/get", authenticate, getConversationController);
//pass in the middleware to validate the the user then i wont have to pass the user id as a param everytime as userID 
//is stored in cookie iteself
conversationRoutes.patch("/remove/:id", authenticate, updateConversationController);

conversationRoutes.get("/get/:id", authenticate, getConversationByIDController);



export default conversationRoutes;