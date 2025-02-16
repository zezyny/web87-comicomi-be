import mongoose from "mongoose";

const UnlockSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    chapterId: mongoose.Types.ObjectId,
    date: Date
})

const Unlock = mongoose.model('unlocks', UnlockSchema)
export default Unlock