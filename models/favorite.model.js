import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    storyId: [{ type: mongoose.Types.ObjectId, ref: 'stories' }],
})

const Favorite = mongoose.model('favorites', FavoriteSchema)
export default Favorite