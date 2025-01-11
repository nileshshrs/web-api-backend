import { Router } from "express";
import { createFollowerController, deleteFollowController, getConnectionController, getFollowerController, getFollowingController, unfollowController } from "../controllers/followController.js";

const followRoutes = Router()

followRoutes.post("/:id", createFollowerController)//todo in frontend
followRoutes.get("/get/following/:id", getFollowingController)
followRoutes.get("/get/followers/:id", getFollowerController)
followRoutes.delete("/unfollow", unfollowController)//todo in frontend
followRoutes.delete("/unfollow/:id", deleteFollowController) //todo in frontend
followRoutes.get("/connections", getConnectionController)

export default followRoutes