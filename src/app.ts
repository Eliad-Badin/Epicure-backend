import express from "express";
import cors from "cors";
import chefRoutes from "./routes/chef.routes";
import restaurantRoutes from "./routes/restaurant.routes"
import dishRoutes from "./routes/dish.routes"
import authRoutes from "./routes/auth.routes"

const app = express();

app.use(cors ({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/api", chefRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", dishRoutes)
app.use("/api/auth", authRoutes);

export default app;