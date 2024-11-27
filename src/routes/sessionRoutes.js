import { Router } from "express";
import { deleteSessionsController, getSessionsController } from "../controllers/sessionController.js";

const sessionRoutes = Router()

sessionRoutes.get('/getSessionsByUser', getSessionsController);
sessionRoutes.delete('/delete/:id', deleteSessionsController);

export default sessionRoutes;