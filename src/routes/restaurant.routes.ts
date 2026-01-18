import { Router } from "express";
import {
  createRestaurantController,
  getRestaurantsController,
  getRestaurantByIdController,
  updateRestaurantController,
  deleteRestaurantController,
} from "../controllers/restaurant.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/restaurants", getRestaurantsController);
router.get("/restaurants/:id", getRestaurantByIdController);
router.post("/restaurants", requireAuth, requireAdmin, createRestaurantController);
router.patch("/restaurants/:id", requireAuth, requireAdmin, updateRestaurantController);
router.delete("/restaurants/:id", requireAuth, requireAdmin, deleteRestaurantController);

export default router;