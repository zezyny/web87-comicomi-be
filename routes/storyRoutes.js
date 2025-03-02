import express from 'express';
import {
    createStory,
    getStory,
    deleteStory,
    getStoriesByCreator, 
    getAllStories       
} from '../controllers/story.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// --- Create Story ---
router.post('/', verifyToken, createStory); // POST /api/v2/stories

// --- Get All Stories (limited, Sorted) ---
router.get('/', getAllStories); // GET /api/v2/stories

// --- Get Story by ID ---
router.get('/:id', getStory); // GET /api/v2/stories/:id

// --- Get Stories by Creator (limit) ---
router.get('/creator/:creatorId', getStoriesByCreator); // GET /api/v2/stories/creator/:creatorId

// --- Delete Story ---
router.delete('/:id', verifyToken, deleteStory); // DELETE /api/v2/stories/:id

export default router;