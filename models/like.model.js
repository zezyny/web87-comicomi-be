import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    related: mongoose.Types.ObjectId,           //storyId, postId, commentId
    userId: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
})

const Like = mongoose.model('likes', LikeSchema)
export default Like