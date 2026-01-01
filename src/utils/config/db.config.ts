import mongoose from "mongoose";

export async function connectDB () {
    const uri = process.env.MONGO_URI as string;
    if (!uri) {
        console.log("no mongo uri available");
    }
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Mongo connection error:", err);
        process.exit(1);
    }
}