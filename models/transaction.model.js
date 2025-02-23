import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    amount: Number,
    date: Date,
    transactionType: String,         //deposit, withdraw, unlock
    token: String
})

const Transaction = mongoose.model('transactions', TransactionSchema)
export default Transaction