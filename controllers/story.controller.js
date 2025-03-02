import storyRepository from "../repositories/story.repository.js";
import { StoryListView, StoryView } from "../views/story.view.js";
import Story from '../models/story.model.js';
import mongoose from "mongoose";

export const getStories = async (req, res) => {
    let { keyword, page, pageSize, orderBy, orderDirection } = req.query;

    if (!page || page <= 0) page = 1;
    if (!pageSize || pageSize <= 0) pageSize = 15;
    if (!orderBy) orderBy = 'createdAt';
    if (!orderDirection) orderDirection = 'desc';

    const result = await storyRepository.getAndPaginateStories(
        { keyword, page, pageSize, orderBy, orderDirection },
        ['user']
    );

    return res.ok({
        ...result,
        stories: StoryListView(result.stories)
    });
}

export const getStory = async (req, res) => {
    const { id } = req.params

    const story = await storyRepository.getStoryById(id)
        (await story.populate(['user']))

    if (!story) {
        return res.notFound('', 'Story was not found')
    }

    return res.ok(StoryView(story))
}

// --- Create Story ---
export const createStory = async (req, res, next) => {
    try {
        const { title, type, genre, status, description } = req.body; 
        const creatorId = req.user.userId; 

        if (!title || !type || !genre || !status || !description ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newStory = new Story({
            title,
            author: req.user.userName,
            creatorId,
            type,
            genre,
            status,
            description,
            release: new Date(), 
            lastUpdate: new Date()
        });

        const savedStory = await newStory.save();

        res.status(201).json({ message: 'Story created successfully', story: savedStory });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        next(error);
    }
};

// --- Get Story by ID ---
export const getStory_v2 = async (req, res, next) => {
    try {
        const storyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({ message: 'Invalid Story ID format' });
        }

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({ story });

    } catch (error) {
        next(error);
    }
};

// --- Delete Story ---
export const deleteStory = async (req, res, next) => {
    try {
        const storyId = req.params.id;
        const userId = req.user.userId; // User ID from token
        const userRole = req.user.role; // User Role from token

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({ message: 'Invalid Story ID format' });
        }

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Authorization Check: Admin / Story Creator only.
        if (userRole !== 'admin' && story.creatorId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this story' });
        }

        await Story.findByIdAndDelete(storyId);

        res.status(200).json({ message: 'Story deleted successfully' });

    } catch (error) {
        next(error);
    }
};

// --- Get Stories by Creator with limit ---
export const getStoriesByCreator = async (req, res, next) => {
    try {
        const creatorId = req.params.creatorId;
        const fromIndex = parseInt(req.query.from) || 0; // Default to 0 if 'from' is not provided or invalid
        const limit = 50; // Limit per page

        if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            return res.status(400).json({ message: 'Invalid Creator ID format' });
        }

        const stories = await Story.find({ creatorId })
            .skip(fromIndex)
            .limit(limit);

        const totalStoriesCount = await Story.countDocuments({ creatorId });
        const nextIndex = fromIndex + limit;
        const nextFlag = nextIndex < totalStoriesCount ? nextIndex : null; // Null if no more stories

        res.status(200).json({
            stories,
            next: nextFlag
        });

    } catch (error) {
        next(error);
    }
};


// --- Get All Stories with limit and Sorting ---
export const getAllStories = async (req, res, next) => {
    try {
        const fromIndex = parseInt(req.query.from) || 0; // Default to 0
        const limit = 50;
        const sortBy = req.query.sortBy || 'release'; // Default sort by release date
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Default desc (newest first)

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;

        const stories = await Story.find({})
            .sort(sortOptions)
            .skip(fromIndex)
            .limit(limit);

        const totalStoriesCount = await Story.countDocuments({});
        const nextIndex = fromIndex + limit;
        const nextFlag = nextIndex < totalStoriesCount ? nextIndex : null;

        res.status(200).json({
            stories,
            next: nextFlag
        });

    } catch (error) {
        next(error);
    }
};