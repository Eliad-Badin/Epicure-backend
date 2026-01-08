import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./utils/config/db.config";

dotenv.config();

const PORT = process.env.PORT;


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
