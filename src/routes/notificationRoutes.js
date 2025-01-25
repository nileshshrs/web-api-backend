import { Router } from "express";
import { createNotificationController, getAllNotificationsController, updateNotificationController } from "../controllers/notifcationController.js";
import authenticate from "../middleware/authenticate.js";


const notificationRoutes = Router();

notificationRoutes.post("/create", authenticate, createNotificationController)

notificationRoutes.get("/all", authenticate, getAllNotificationsController)

notificationRoutes.get("/update", authenticate, updateNotificationController)

export default notificationRoutes;