import express from "express";
import { addDraft, getDraft, getDrafts, updateDraft } from "../Controllers/DraftController.js";
const router = express.Router();


router.post('/addDraft', addDraft);
router.get('/getDrafts',getDrafts);
router.get('/getDraft/:id',getDraft);
router.put('/updateDraft/:id',updateDraft)

export default router;