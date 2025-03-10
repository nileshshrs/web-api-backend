import { Router } from "express";
import {
    createPostController,
    getMobilePostController,
    getPostController,
    getPostsByIDController,
    getPostsByUserController,
    getPostsByUserIDController
} from "../controllers/postController.js";
import authenticate from "../middleware/authenticate.js";

const postRoutes = Router();

postRoutes.post("/create", authenticate, createPostController);
postRoutes.get("/get", authenticate, getPostController);
postRoutes.get("/mobile/get", authenticate, getMobilePostController);
postRoutes.get("/getByUser", authenticate, getPostsByUserController)
postRoutes.get("/get/user/:id", authenticate, getPostsByUserIDController)
postRoutes.get("/get/:id", authenticate, getPostsByIDController);

export default postRoutes;