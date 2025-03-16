import express from 'express';
import {
    createStory,
    getStory,
    deleteStory,
    getStoriesByCreator, 
    getAllStories,       
    uploadStoryBanner
} from '../controllers/story.controller.js';
import { verifyToken, permissionAuth } from '../middlewares/auth.middleware.js'; 
import multer from 'multer';

const router = express.Router();

// --- Create Story ---
router.post('/', permissionAuth, createStory); // POST /api/v2/stories

// --- Get All Stories (limited, Sorted) ---
router.get('/', getAllStories); // GET /api/v2/stories

// --- Get Story by ID ---
router.get('/:id', getStory); // GET /api/v2/stories/:id

// --- Get Stories by Creator (limit) ---
router.get('/creator/:creatorId', getStoriesByCreator); // GET /api/v2/stories/creator/:creatorId

// --- Delete Story ---
router.delete('/:id', permissionAuth, deleteStory); // DELETE /api/v2/stories/:id

router.post('/upload/banner', permissionAuth, multer().single('banner'), uploadStoryBanner)

export default router;