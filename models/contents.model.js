//This is an privacy DB layer for server to hide actual address of image / content
import mongoose, { Schema } from "mongoose";

const ContentSchema = new mongoose.Schema({
    fileName: String, // path of saved file
    type: String, // LightNovel / Comic
    chapterId: mongoose.Types.ObjectId,
    isDeleted: Boolean
})

const Content = mongoose.model('contents', ContentSchema)
export default Content