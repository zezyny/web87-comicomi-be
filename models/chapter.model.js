import mongoose, { Schema } from "mongoose";

const ChapterSchema = new mongoose.Schema({
    chapterTitle: String,
    chargeType: String, // Free / Ads / Paid
    type: String,           //comic, novel
    released: Boolean, //Chuong da release hay chua
    storyId: mongoose.Types.ObjectId,
    content: [Schema.Types.Mixed],
    chapterNumber: Number,
    uploadAt: Date,
    price: Number
})

const Chapter = mongoose.model('chapters', ChapterSchema)
export default Chapter