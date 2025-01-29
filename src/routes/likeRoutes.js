import { Router } from "express";
import { getPostLikedData, toggleLikeController } from "../controllers/likeController.js";

const likeRoutes = Router() ;

likeRoutes.post("/toggle-likes", toggleLikeController)
likeRoutes.get("/likes-by-post/:id", getPostLikedData)


export default likeRoutes   ;