import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    userId: String,
    favoriteList: [{
        storyId: { type: mongoose.Types.ObjectId, ref: 'stories' },
        date: Date
    }]
})

const Favorite = mongoose.model('favorites', FavoriteSchema)
export default Favorite