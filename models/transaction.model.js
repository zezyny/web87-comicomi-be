import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    amount: Number,
    date: Date
})

const Transaction = mongoose.model('transactions', TransactionSchema)
export default Transaction