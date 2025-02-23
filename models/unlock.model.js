import mongoose from "mongoose";

const UnlockSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    chapterId: { type: mongoose.Types.ObjectId, ref: 'chapters' },
    transactionId: { type: mongoose.Types.ObjectId, ref: 'transactions' }
})

const Unlock = mongoose.model('unlocks', UnlockSchema)
export default Unlock