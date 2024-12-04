import { Router } from "express";
import { createMessageController, getMessagesController } from "../controllers/messageController.js";

const messageRoutes = Router()

messageRoutes.get('/', (req, res) => {
    console.log("hello world!");
})

messageRoutes.post("/create/:id", createMessageController)
messageRoutes.get("/conversation/", getMessagesController)

export default messageRoutes;