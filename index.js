import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import db from './database/db.js';
import { simpleResponse } from './middlewares/simpleResponse.middleware.js';
import { authentication } from './middlewares/auth.middleware.js';
import { deleteUser, getAllUsers, getUser, getUsers } from './controllers/user.controller.js';
import { getStories, getStory } from './controllers/story.controller.js';

import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import securityHeaders from './middlewares/securityHeaders.js';

import storyRoutes from './routes/storyRoutes.js';
import { getListByUserId } from './controllers/favorite.controller.js';

import chapterRoutes from './routes/chapterRoutes.js';
import { getUnlockByCreatorId } from './controllers/unlock.controller.js';
import { getTransactions } from './controllers/transaction.controller.js';

import cdnRoutes from './routes/tempCDN.route.js';

import commentRoutes from './routes/commentRoutes.js'

dotenv.config();

const app = express();

db.connect();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    // credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization' // Allowed headers
}));

// Custom middleware for responses
app.use(simpleResponse);

// app.use(express.urlencoded({ extended: true }));

// Security middlewares
app.use(helmet());
app.use(securityHeaders);

// Authentication routes
app.use('/auth', authRoutes);

// Story APIs
app.use('/api/v2/stories', storyRoutes);

// Chapter APIs
app.use('/api', chapterRoutes);


//comment & miscs

app.use('/api/v2', commentRoutes)

// CDN APIs
app.use('/cdn', cdnRoutes);

// User routes
app.get('/api/v1/user', getUsers);
app.get('/api/v1/user/:id/detail', getUser);
app.put('/api/v1/user/:id/delete', deleteUser);

// Story routes
app.get('/api/v1/story', getStories);
app.get('/api/v1/story/:id/detail', getStory);

// Favorite routes
app.get('/api/v1/favorite/:userId', getListByUserId);

//unlock
app.get('/api/v1/unlock', getUnlockByCreatorId)

//transaction
app.get('/api/v1/transaction', getTransactions)

app.use(errorHandler);

// Start the server
app.listen(8080, () => {
    console.log('Express app started at port 8080');
});
