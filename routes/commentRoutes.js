import { getCommentsFromChapter, getCommentsFromStory, getLikeCountOfComment, postComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from 'express';

const route = express.Router()

route.post("/comment", verifyToken, postComment);

route.get("/comments/chapter/:chapterId", getCommentsFromChapter)

route.get("/comments/story/:storyId", getCommentsFromStory)

route.get("/comment/likes/:commentId", getLikeCountOfComment)


export default route