import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';

import db from './database/db.js'
import { simpleResponse } from './middlewares/simpleResponse.middleware.js';
import { authentication } from './middlewares/auth.middleware.js';
import { getUser, getUsers } from './controllers/user.controller.js';
import { getStories, getStory } from './controllers/story.controller.js';

dotenv.config()

const app = express()

db.connect()

app.use(express.json())
app.use(cors())
app.use(simpleResponse)

//user
app.get('/api/v1/user', getUsers)
app.get('/api/v1/user/:id/detail', getUser)

//story
app.get('/api/v1/story', getStories)
app.get('/api/v1/story/:id/detail', getStory)

app.listen(8080, () => {
    console.log("Express app started at port 8080");
})