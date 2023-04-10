import express from "express";
const router = express.Router();
import {generateModel} from '../controllers/classController.js';

router
.route("/generateModel/:nameProject")
.post(generateModel);

export default router;