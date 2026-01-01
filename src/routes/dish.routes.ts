import { Router } from "express";
import {
  createDishController,
  getDishesController,
  getDishByIdController,
  updateDishController,
  deleteDishController,
} from "../controllers/dish.controller";

const router = Router();

router.post("/dishes", createDishController);
router.get("/dishes", getDishesController);
router.get("/dishes/:id", getDishByIdController);
router.patch("/dishes/:id", updateDishController);
router.delete("/dishes/:id", deleteDishController);

export default router;
