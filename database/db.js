import mongoose, { connect } from "mongoose";

const db = {
    connect: async () => {
        const DB_URL = process.env.DB_URL
        await mongoose.connect(DB_URL)
        console.log('Connected to database')
    }
}

export default db