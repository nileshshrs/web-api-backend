import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { createMessageController,  getMessagesController} from "../controllers/messageController.js";

const messageRoutes = Router();

messageRoutes.get('/', (req, res) => {
    console.log("hello world!");
})

messageRoutes.post("/create/:id", authenticate, createMessageController);
messageRoutes.get("/conversation/:id", authenticate, getMessagesController);

export default messageRoutes;