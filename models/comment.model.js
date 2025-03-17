import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    storyId: mongoose.Types.ObjectId,
    chapterId: mongoose.Types.ObjectId,
    content: String,
    date: Date,
    like: [mongoose.Types.ObjectId]
})

const Comment = mongoose.model('comments', CommentSchema)
export default Comment