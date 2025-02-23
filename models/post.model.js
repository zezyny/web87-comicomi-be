import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: String,
    userId: mongoose.Types.ObjectId,
    content: String,
    postDate: Date,
    updateDate: Date,
    categories: [String],           //review, discussion,...
    related: mongoose.Types.ObjectId
})

const Post = mongoose.model('posts', PostSchema)
export default Post