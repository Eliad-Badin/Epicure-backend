import { Router } from "express";
import {
  createDishController,
  getDishesController,
  getDishByIdController,
  updateDishController,
  deleteDishController,
} from "../controllers/dish.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/dishes", getDishesController);
router.get("/dishes/:id", getDishByIdController);
router.post("/dishes", requireAuth, requireAdmin, createDishController);
router.patch("/dishes/:id", requireAuth, requireAdmin, updateDishController);
router.delete("/dishes/:id", requireAuth, requireAdmin, deleteDishController);

export default router;
