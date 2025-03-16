import express from 'express';
import { resolveBannerGet } from '../controllers/cdn.controller.js';

const router = express.Router();

router.get("/banner/:traceId", resolveBannerGet)
router.get("/comic/:chapterId/:traceId")

export default router;
