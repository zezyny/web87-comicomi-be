import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    amount: Number,
    date: Date,
    transactionType: String,         //deposit, withdraw, unlock
    transactionToken: String
})

const Transaction = mongoose.model('transactions', TransactionSchema)
export default Transaction