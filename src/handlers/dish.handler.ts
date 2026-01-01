import { Types } from "mongoose";
import { Dish, type DishInterface } from "../models/dish.model";
import type { CreateDishInput, UpdateDishInput } from "../utils/validations/dish.validation";

const INVALID_ID = "Invalid dish id";
const NOT_FOUND = "Dish not found";

export const createDish = async (
  data: CreateDishInput
): Promise<DishInterface> => {
  const { restaurantId, ...rest } = data;
  const restaurantObjectId = new Types.ObjectId(restaurantId);

  const dish = await Dish.create({
    ...rest,
    restaurant: restaurantObjectId,
  });

  return dish;
};

export const getDishes = async (): Promise<DishInterface[]> => {
  return Dish.find().lean();
};

export const getDishById = async (
  id: string
): Promise<DishInterface | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const dish = await Dish.findById(id).lean();
  if (!dish) {
    throw new Error(NOT_FOUND);
  }

  return dish;
};

export const updateDish = async (
  id: string,
  data: UpdateDishInput
): Promise<DishInterface> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const update: Record<string, unknown> = { ...data };

  if (data.restaurantId) {
    update.restaurant = new Types.ObjectId(data.restaurantId);
    delete update.restaurantId;
  }

  const dish = await Dish.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!dish) {
    throw new Error(NOT_FOUND);
  }

  return dish;
};

export const deleteDish = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const deleted = await Dish.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error(NOT_FOUND);
  }
};
