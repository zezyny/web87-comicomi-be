import express from 'express';
import { authentication } from '../middlewares/auth.middleware.js'
import { checkAccessToEditChapter } from '../middlewares/access.middleware.js';
import {
    createChapter,
    deleteChapter,
    updateChapter,
    getChapterDetail,
    getAllChaptersOfStory,
    getChapterContent,
    saveNovelChapterContent,
    publishChapter,
    requestChapterContentForUser,
    requestChapterContentForAdminAndCreator
} from '../controllers/chapter.controller.js';

const router = express.Router();


router.post('/chapter/create', authentication, createChapter);

router.delete('/chapters/:id', authentication, deleteChapter);

router.put('/chapters/:id', authentication, updateChapter);

router.get('/chapters/:id', getChapterDetail);

router.get('/chapter/:id/contents', getChapterContent);

router.get('/stories/:storyId/chapters', getAllChaptersOfStory);

router.post('/chapter/save-content/novel/:chapterId', checkAccessToEditChapter, saveNovelChapterContent)

router.get('/chapter/publish/:chapterId', checkAccessToEditChapter, publishChapter)

router.get('/chapter/contents/:chapterId', requestChapterContentForUser) // no auth needed, for released chapter.

router.get('/chapter/contents/:chapterId/private', checkAccessToEditChapter, requestChapterContentForAdminAndCreator) // no auth needed, for released chapter.

export default router;