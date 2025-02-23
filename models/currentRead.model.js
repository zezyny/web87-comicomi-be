import mongoose from "mongoose";

const CurrentReadSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    currentReadList: [{
        storyId: { type: mongoose.Types.ObjectId, ref: 'stories' },
        date: Date
    }]
})

const CurrentRead = mongoose.model('currentReads', CurrentReadSchema)
export default CurrentRead