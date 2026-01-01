import { Router } from "express";
import {
  createRestaurantController,
  getRestaurantsController,
  getRestaurantByIdController,
  updateRestaurantController,
  deleteRestaurantController,
} from "../controllers/restaurant.controller";

const router = Router();

router.post("/restaurants", createRestaurantController);
router.get("/restaurants", getRestaurantsController);
router.get("/restaurants/:id", getRestaurantByIdController);
router.patch("/restaurants/:id", updateRestaurantController);
router.delete("/restaurants/:id", deleteRestaurantController);

export default router;