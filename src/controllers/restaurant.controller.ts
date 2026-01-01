import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../handlers/restaurant.handler";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  restaurantIdParamSchema,
  UpdateRestaurantInput,
} from "../utils/validations/restaurant.validation";
import { INVALID_ID, NOT_FOUND } from "../constants/strings";

export const createRestaurantController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = createRestaurantSchema.parse(req.body);
    const restaurant = await createRestaurant(body);
    return res.status(201).json(restaurant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    if (err instanceof Error && err.message === INVALID_ID) {
      return res.status(400).json({ error: "Invalid chef id" });
    }
    return next(err);
  }
};

export const getRestaurantsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurants = await getRestaurants();
    return res.status(200).json(restaurants);
  } catch (err) {
    return next(err);
  }
};

export const getRestaurantByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = restaurantIdParamSchema.parse(req.params);
    const restaurant = await getRestaurantById(params.id);
    return res.status(200).json(restaurant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    if (err instanceof Error && err.message === INVALID_ID) {
      return res.status(400).json({ error: "Invalid restaurant id" });
    }
    if (err instanceof Error && err.message === NOT_FOUND) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return next(err);
  }
};

export const updateRestaurantController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = restaurantIdParamSchema.parse(req.params);
    const body: UpdateRestaurantInput = updateRestaurantSchema.parse(req.body);

    const restaurant = await updateRestaurant(params.id, body);
    return res.status(200).json(restaurant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    if (err instanceof Error && err.message === INVALID_ID) {
      return res.status(400).json({ error: "Invalid restaurant id" });
    }
    if (err instanceof Error && err.message === NOT_FOUND) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return next(err);
  }
};

export const deleteRestaurantController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = restaurantIdParamSchema.parse(req.params);
    await deleteRestaurant(params.id);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    if (err instanceof Error && err.message === INVALID_ID) {
      return res.status(400).json({ error: "Invalid restaurant id" });
    }
    if (err instanceof Error && err.message === NOT_FOUND) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return next(err);
  }
};
