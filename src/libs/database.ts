import mongoose from "mongoose";

export async function connecttoDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Connected to Database")
    } catch (e) {
        console.log("Failed to connect to Db", e)
    }
}