import { Router } from "express";
import { createConversationController, createMobileConversationController, getConversationByIDController, getConversationController, updateConversationController, updateReadConversationController } from "../controllers/conversationController.js";
import authenticate from "../middleware/authenticate.js";

const conversationRoutes = Router();

conversationRoutes.post("/create", authenticate, createConversationController);
conversationRoutes.post("/mobile/create", authenticate, createMobileConversationController);
//pass in the middleware to validate the the user then i wont have to pass the user id as a param everytime as userID 
//is stored in cookie iteself
conversationRoutes.get("/get", authenticate, getConversationController);
//pass in the middleware to validate the the user then i wont have to pass the user id as a param everytime as userID 
//is stored in cookie iteself
conversationRoutes.patch("/remove/:id", authenticate, updateConversationController);

conversationRoutes.get("/get/:id", authenticate, getConversationByIDController);

conversationRoutes.get("/update/:id", authenticate, updateReadConversationController);



export default conversationRoutes;