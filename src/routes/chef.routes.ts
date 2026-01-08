import { Router } from "express";
import {
  createChefController,
  getChefsController,
  getChefByIdController,
  updateChefController,
  deleteChefController,
  getChefOfTheWeekController,
} from "../controllers/chef.controller";

const router = Router();

router.post("/chefs", createChefController);
router.get("/chefs", getChefsController);
router.get("/chefs/chef-of-the-week", getChefOfTheWeekController);
router.get("/chefs/:id", getChefByIdController);
router.patch("/chefs/:id", updateChefController);
router.delete("/chefs/:id", deleteChefController);


export default router;
