import express from "express";
import chefRoutes from "./routes/chef.routes";
import restaurantRoutes from "./routes/restaurant.routes"
import dishRoutes from "./routes/dish.routes"

const app = express();

app.use(express.json());
app.use("/api", chefRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", dishRoutes)

export default app;