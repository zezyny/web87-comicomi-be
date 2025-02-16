import mongoose from "mongoose";

const PostCommentSchema = new mongoose.Schema({
    postId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    content: String,
    date: Date
})

const PostComment = mongoose.model('postComments', PostCommentSchema)
export default PostComment