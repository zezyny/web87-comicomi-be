import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
    title: String,
    author: String,
    creatorId: { type: mongoose.Types.ObjectId, ref: 'users' },
    img: String,
    type: String,           //comic, novel
    genre: [String],        //comedy, drama, fantasy, horror,...
    status: String,         //ongoing, completed
    description: String,
    release: Date,
    lastUpdate: Date
})

const Story = mongoose.model('stories', StorySchema)
export default Story