import express from 'express';
import { resolveBannerGet, resolveComicGet } from '../controllers/cdn.controller.js';

const router = express.Router();

router.get("/banner/:traceId", resolveBannerGet)
router.get("/comic/:chapterId/:traceId", resolveComicGet)

export default router;
