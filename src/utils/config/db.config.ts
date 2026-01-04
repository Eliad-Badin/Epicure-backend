import mongoose from "mongoose";

export async function connectDB () {
    const uri = process.env.MONGO_URI as string;
    if (!uri) {
        console.warn("no mongo uri available, skipping DB connection");
        return;
    }
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Mongo connection error:", err);
        throw err;
    }
};

export const disconnectDB = async () => {
    if(mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
};