import { Router } from "express";
import {
  createChefController,
  getChefsController,
  getChefByIdController,
  updateChefController,
  deleteChefController,
} from "../controllers/chef.controller";

const router = Router();

router.post("/chefs", createChefController);
router.get("/chefs", getChefsController);
router.get("/chefs/:id", getChefByIdController);
router.patch("/chefs/:id", updateChefController);
router.delete("/chefs/:id", deleteChefController);

export default router;
