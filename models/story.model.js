import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
    title: String,
    author: String,
    creatorId: mongoose.Types.ObjectId,
    type: String,
    genre: [String],
    status: String,
    description: String,
    release: Date,
    lastUpdate: Date,
    like: [mongoose.Types.ObjectId]
})

const Story = mongoose.model('stories', StorySchema)
export default Story