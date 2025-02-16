import { Router } from "express";
import {
    createCommentController,
    deleteCommentController,
    getComments
} from "../controllers/commentController.js";
import authenticate from "../middleware/authenticate.js";


const commentRoutes = Router();

commentRoutes.post("/create",authenticate, createCommentController);
commentRoutes.get("/get/:id", authenticate, getComments);
commentRoutes.delete("/delete/:id", deleteCommentController);

export default commentRoutes;