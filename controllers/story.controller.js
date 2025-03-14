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
    try {
        const { id } = req.params;

        // Fetch the story by its ID and populate the user field
        const story = await Story.findOne({_id: id, isDeleted: false}).populate('creatorId');

        if (!story) {
            return res.status(404).json({
                message: 'Story not found or deleted.'
            });
        }

        return res.status(200).json({
            creator:{
                creatorId: story.creatorId._id,
                creatorName: story.creatorId.userName
            },
            description: story.description,
            genre: story.genre,
            img: story.img,
            release: story.release,
            status: story.status,
            title: story.title,
            type: story.type
        });
    } catch (err) {
        console.error("Error: Can't search for story", err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// --- Create Story ---
export const createStory = async (req, res, next) => {
    try {
        //Chinh lai validate =)))))
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
            lastUpdate: new Date(),
            isDeleted: false
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

        const story = await Story.findOne({_id:storyId, isDeleted:false});

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

        const story = await Story.findOne({_id: storyId, isDeleted: false});

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Authorization Check: Admin / Story Creator only.
        if (userRole !== 'admin' && story.creatorId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this story' });
        }

        await Story.findById(storyId).updateOne({isDeleted: true});

        res.status(200).json({ message: 'Story deleted successfully' });

    } catch (error) {
        next(error);
    }
};
//-- Get all stories, implemented search with regex :D --
export const getStoriesByCreator = async (req, res, next) => {
    try {
        const creatorId = req.params.creatorId;
        const fromIndex = parseInt(req.query.from) || 0;
        const limit = 50;
        const search = req.query.search; 

        if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            return res.status(400).json({ message: 'Invalid Creator ID format' });
        }

        let query = { creatorId };

        if (search) { 
            query = {
                creatorId, 
                $or: [     
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const stories = await Story.find(query) 
            .skip(fromIndex)
            .limit(limit);

        const totalStoriesCount = await Story.countDocuments(query); 
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


// --- Get All Stories with Pagination and Sorting ---
export const getAllStories = async (req, res, next) => {
    try {
        console.log("Getting stories.")
        const fromIndex = parseInt(req.query.from) || 0;
        const limit = 50;
        const sortBy = req.query.sortBy || 'release';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search; 

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;

        let query = {isDeleted: false}; 

        if (search) { 
            query[$or] = [{ title: { $regex: search, $options: 'i' } }, 
                { description: { $regex: search, $options: 'i' } }]
        }

        const stories = await Story.find(query) 
            .sort(sortOptions)
            .skip(fromIndex)
            .limit(limit);

        const totalStoriesCount = await Story.countDocuments(query); 
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