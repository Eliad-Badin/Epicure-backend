import type { Request, Response, NextFunction } from "express";
import {
  createDishSchema,
  updateDishSchema,
  dishIdParamSchema,
} from "../utils/validations/dish.validation";
import {
  createDish,
  getDishes,
  getDishById,
  updateDish,
  deleteDish,
} from "../handlers/dish.handler";

export const createDishController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = createDishSchema.parse(req.body);
    const dish = await createDish(body);
    res.status(201).json(dish);
  } catch (err) {
    next(err);
  }
};

export const getDishesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dishes = await getDishes();
    res.status(200).json(dishes);
  } catch (err) {
    next(err);
  }
};

export const getDishByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = dishIdParamSchema.parse(req.params);
    const dish = await getDishById(params.id);
    res.status(200).json(dish);
  } catch (err) {
    next(err);
  }
};

export const updateDishController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = dishIdParamSchema.parse(req.params);
    const body = updateDishSchema.parse(req.body);

    const dish = await updateDish(params.id, body);
    res.status(200).json(dish);
  } catch (err) {
    next(err);
  }
};

export const deleteDishController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = dishIdParamSchema.parse(req.params);
    await deleteDish(params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
