import "dotenv/config";
import express from "express";
import { connectDB } from "./utills/config/db.config";
import { Chef } from "./models/Chef.model";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.get("/health", (_req, res) =>{
    res.json({status: "ok"});
});

app.get("/chefs-test", async(_req, res) => {
    const chefs = await Chef.find().limit(5);
    res.json(chefs);
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});