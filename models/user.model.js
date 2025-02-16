import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    avatar: String,
    salt: String,
    role: String,
    wallet: Number,
    favorites: [String],
    reading: [{
        storyId: mongoose.Types.ObjectId,
        date: Date
    }]
})

const User = mongoose.model('users', UserSchema)
export default User