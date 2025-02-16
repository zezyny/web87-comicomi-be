import express from 'express'
import dotenv from 'dotenv';
import db from './database/db.js'

dotenv.config()

const app = express()

db.connect()

app.use(express.json())

app.listen(8080, () => {
    console.log("Express app started at port 8080");
})