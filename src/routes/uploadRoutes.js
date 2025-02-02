import { Router } from "express";
import { uploadImage } from "../controllers/imageController.js";

const uploadRoutes = Router();

uploadRoutes.post("/images", uploadImage);


export default uploadRoutes ;