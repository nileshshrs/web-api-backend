import { Router } from "express";
import { createFollowerController, deleteFollowController, getConnectionController, getFollowerController, getFollowingController, unfollowController } from "../controllers/followController.js";

const followRoutes = Router()

followRoutes.post("/:id", createFollowerController)
followRoutes.get("/get/following", getFollowingController)
followRoutes.get("/get/followers", getFollowerController)
followRoutes.delete("/unfollow", unfollowController)
followRoutes.delete("/unfollow/:id", deleteFollowController)
followRoutes.get("/connections", getConnectionController)

export default followRoutes