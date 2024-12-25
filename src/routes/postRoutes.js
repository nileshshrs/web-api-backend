import { Router } from "express";
import { createPostController } from "../controllers/postController.js";
import authenticate from "../middleware/authenticate.js";

const postRoutes = Router();

postRoutes.post("/create",authenticate, createPostController) ;

export default postRoutes;