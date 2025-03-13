import Chapter from '../models/chapter.model.js';
import { validateChapterData } from '../utils/validation.utils.js';

export const createChapter = async (req, res) => {
    try {
        const { chapterTitle, chargeType, type, storyId, price } = req.body; 

        const chapterData = { chapterTitle, chargeType, type, storyId, price };

        const errors = validateChapterData(chapterData); 
        if (errors) {
            return res.status(400).json({ message: 'Validation errors', errors });
        }

        const uploadAt = new Date();
        const released = false;

        const lastChapter = await Chapter.findOne({ storyId }).sort({ chapterNumber: -1 }).limit(1);
        const chapterNumber = lastChapter ? lastChapter.chapterNumber + 1 : 1;

        const newChapter = new Chapter({
            chapterTitle,
            chargeType,
            type,
            storyId,
            chapterNumber,
            uploadAt,
            released,
            price,
            content: []
        });

        const savedChapter = await newChapter.save();
        res.status(201).json(savedChapter);
    } catch (error) {
        console.error("Error creating chapter:", error);
        res.status(500).json({ message: 'Failed to create chapter', error: error.message });
    }
};

export const deleteChapter = async (req, res) => {
    try {
        const chapterId = req.params.id;

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        await Chapter.findByIdAndDelete(chapterId);
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error("Error deleting chapter:", error);
        res.status(500).json({ message: 'Failed to delete chapter', error: error.message });
    }
};

export const updateChapter = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const updates = req.body;

        if (updates.chargeType && !['Free', 'Ads', 'Paid'].includes(updates.chargeType)) {
            return res.status(400).json({ message: 'Invalid chargeType', errors: { chargeType: 'Charge type must be one of: Free, Ads, Paid.' } });
        }
        if (updates.type && !['comic', 'novel'].includes(updates.type)) {
            return res.status(400).json({ message: 'Invalid type', errors: { type: 'Type must be one of: comic, novel.' } });
        }

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, updates, { new: true });
        res.status(200).json(updatedChapter);
    } catch (error) {
        console.error("Error updating chapter:", error);
        res.status(500).json({ message: 'Failed to update chapter', error: error.message });
    }
};

export const getChapterDetail = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter.findById(chapterId).select('-content');

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.status(200).json(chapter);
    } catch (error) {
        console.error("Error getting chapter detail:", error);
        res.status(500).json({ message: 'Failed to get chapter detail', error: error.message });
    }
};

export const getChapterContent = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter.findById(chapterId).select('content'); 

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.status(200).json(chapter.content); 
    } catch (error) {
        console.error("Error getting chapter content:", error);
        res.status(500).json({ message: 'Failed to get chapter content', error: error.message });
    }
};


export const getAllChaptersOfStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        let { start, stop, search } = req.query;
        let query = { storyId: storyId };
        let options = {};

        if (search) {
            query.chapterTitle = { $regex: search, $options: 'i' }; 
        }

        if (start && stop) {
            const startIndex = parseInt(start);
            const stopIndex = parseInt(stop);
            const limit = stopIndex - startIndex;
            const skip = startIndex;

            options = {
                skip: Math.max(0, skip),
                limit: Math.max(0, limit)
            };
        }

        const chapters = await Chapter.find(query, null, options).sort({ chapterNumber: 1 });
        res.status(200).json(chapters);
    } catch (error) {
        console.error("Error getting chapters for story:", error);
        res.status(500).json({ message: 'Failed to get chapters for story', error: error.message });
    }
};