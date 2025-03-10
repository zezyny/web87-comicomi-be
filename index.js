import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';

import db from './database/db.js'
import { simpleResponse } from './middlewares/simpleResponse.middleware.js';
import { authentication } from './middlewares/auth.middleware.js';
import { deleteUser, getAllUsers, getUser, getUsers } from './controllers/user.controller.js';
import { getStories, getStory } from './controllers/story.controller.js';

import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import securityHeaders from './middlewares/securityHeaders.js';

import storyRoutes from './routes/storyRoutes.js'
import { getListByUserId } from './controllers/favorite.controller.js';

dotenv.config()

const app = express()

db.connect()

app.use(express.json())
app.use(cors())
app.use(simpleResponse)

// Middlewares
app.use(helmet());
app.use(securityHeaders);

//auth routes

app.use('/auth', authRoutes);

//Story APIs
app.use('/api/v2/stories', storyRoutes);

//user
app.get('/api/v1/user', getUsers)
app.get('/api/v1/user/:id/detail', getUser)
app.put('/api/v1/user/:id/delete', deleteUser)

//story
app.get('/api/v1/story', getStories)
app.get('/api/v1/story/:id/detail', getStory)

//favorite
app.get('/api/v1/favorite/:userId', getListByUserId)

app.use(errorHandler);

app.listen(8080, () => {
    console.log("Express app started at port 8080");
})