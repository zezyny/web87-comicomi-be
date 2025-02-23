import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    avatar: String,
    salt: String,
    role: String,           //member, creator, admin
    wallet: Number
})

const User = mongoose.model('users', UserSchema)
export default User