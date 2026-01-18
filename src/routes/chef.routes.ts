import { Router } from "express";
import {
  createChefController,
  getChefsController,
  getChefByIdController,
  updateChefController,
  deleteChefController,
  getChefOfTheWeekController,
} from "../controllers/chef.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/chefs", getChefsController);
router.get("/chefs/chef-of-the-week", getChefOfTheWeekController);
router.get("/chefs/:id", getChefByIdController);
router.post("/chefs", requireAuth, requireAdmin, createChefController);
router.patch("/chefs/:id", requireAuth, requireAdmin, updateChefController);
router.delete("/chefs/:id", requireAuth, requireAdmin, deleteChefController);


export default router;
