import mongoose, { Schema } from "mongoose";

const ChapterSchema = new mongoose.Schema({
    chapterTitle: String,
    chargeType: String, // Free / Ads / Paid
    type: String,           //comic, novel
    released: Boolean, //Chuong da release hay chua
    storyId: mongoose.Types.ObjectId,
    content: [Schema.Types.ObjectId],
    chapterNumber: Number,
    uploadAt: Date,
    price: Number,
    isDeleted: Boolean
})

const Chapter = mongoose.model('chapters', ChapterSchema)
export default Chapter