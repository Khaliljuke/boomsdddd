import express from "express";
import { addClass, getClasses } from "../Controllers/EntityController.js";
const router = express.Router();


router.post('/addClass', addClass);
router.get('/getClasses',getClasses);

export default router;