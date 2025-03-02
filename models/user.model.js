import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: String,
    salt: String,
    role: { type: String, enum: ['member', 'creator', 'admin'], default: 'member' },
    token: String,
    refreshToken: String,
    wallet: { type: Number, default: 0 }
}, { timestamps: true }); 

const User = mongoose.model('users', UserSchema)
export default User