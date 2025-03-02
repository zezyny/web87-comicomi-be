// routes/storyRoutes.js
import express from 'express';
import { createStory, deleteStory, getStory_v2 } from '../controllers/story.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// --- Create Story ---
router.post('/', verifyToken, createStory); // POST /api/v2/stories

// --- Get Story by ID ---
router.get('/:id', getStory_v2); // GET /api/v2/stories/:id

// --- Delete Story ---
router.delete('/:id', verifyToken, deleteStory); // DELETE /api/v2/stories/:id

export default router;