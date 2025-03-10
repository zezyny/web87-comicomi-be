import express from 'express';
import { authentication } from '../middlewares/auth.middleware.js'
import {
    createChapter,
    deleteChapter,
    updateChapter,
    getChapterDetail,
    getAllChaptersOfStory,
    getChapterContent
} from '../controllers/chapter.controller.js';

const router = express.Router();


router.post('/chapter/create', authentication, createChapter);

router.delete('/chapters/:id', authentication, deleteChapter);

router.put('/chapters/:id', authentication, updateChapter);

router.get('/chapters/:id', getChapterDetail);

router.get('/chapter/:id/contents', getChapterContent);

router.get('/stories/:storyId/chapters', getAllChaptersOfStory);


export default router;