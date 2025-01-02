import { Router } from "express";
import { createPostController, getPostController } from "../controllers/postController.js";
import authenticate from "../middleware/authenticate.js";

const postRoutes = Router();

postRoutes.post("/create", authenticate, createPostController);
postRoutes.get("/get", authenticate, getPostController);

export default postRoutes;