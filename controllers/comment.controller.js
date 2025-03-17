import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";


export const postComment = async(req, res) => {
    try{
        const user = req.user
        const {CommentContent, storyId, chapterId} = req.body
        const newComment = await Comment.create({
            userId: user.userId,
            chapterId: chapterId,
            storyId: storyId,
            content: CommentContent,
            date: Date.now(),
            like: []
        })
        res.status(200).json({message:"Posted!"})
    }catch(err){

        console.log("Error on posting comment:", err)
        res.status(403).json({message:"Maybe we need to maintain our codebase, it's a whole mess..."})
    }
    
}

export const getCommentsFromChapter = async(req, res) => {
    try{
        const {chapterId} = req.params
        const Comments = (await Comment.find({chapterId: chapterId})).reverse()
        
        return res.status(200).json({comments: Comments})
    }catch(err){
        console.log("Error on get comment of chapter:", err)
        res.status(403).json({message:"Maybe we need to maintain our codebase, it's a whole mess..."})
    }
}

export const getCommentsFromStory = async(req, res) => {
    try{
        const {storyId} = req.params
        const Comments = await Comment.find({storyId: storyId}).reverse()
        
        return res.status(200).json({comments: Comments})
    }catch(err){
        console.log("Error on get comment of chapter:", err)
        res.status(403).json({message:"Maybe we need to maintain our codebase, it's a whole mess..."})
    }
}

export const getLikeCountOfComment = async(req, res) => {
    try{
        const {commentId} = req.params
        const likes = await Like.find({related: commentId}).countDocuments()
        res.status(200).json({count:likes})
    }catch(err){
        console.log("Error on counting like for comment:", err)
        res.status(404).json({error:err})
    }
}