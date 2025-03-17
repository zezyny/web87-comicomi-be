import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    related: mongoose.Types.ObjectId,           //storyId, postId, commentId
    userId: mongoose.Types.ObjectId,
    // relatedTo: String // Related to Chapter / Post / Comment 
})

const Like = mongoose.model('likes', LikeSchema)
export default Like