import { Types } from "mongoose";
import { Restaurant, type RestaurantInterface } from "../models/restaurant.model";
import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../utils/validations/restaurant.validation";
import { INVALID_ID, NOT_FOUND } from "../constants/strings";



export const createRestaurant = async (
  data: CreateRestaurantInput
): Promise<RestaurantInterface> => {
  const payload: Partial<RestaurantInterface> = {
    name: data.name,
    image: data.image,
    chef: new Types.ObjectId(data.chef),
    ...(data.dishes && {
      dishes: data.dishes.map((id) => new Types.ObjectId(id)),
    }),
  };

  const restaurant = await Restaurant.create(payload);
  return restaurant;
};

export const getRestaurants = async (): Promise<RestaurantInterface[]> => {
  return Restaurant.find().lean();
};

export const getRestaurantById = async (
  id: string
): Promise<RestaurantInterface | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const restaurant = await Restaurant.findById(id).lean();
  if (!restaurant) {
    throw new Error(NOT_FOUND);
  }

  return restaurant;
};

export const updateRestaurant = async (
  id: string,
  data: UpdateRestaurantInput
): Promise<RestaurantInterface> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const restaurant = await Restaurant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    throw new Error(NOT_FOUND);
  }

  return restaurant;
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const restaurant = await Restaurant.findByIdAndDelete(id);

  if (!restaurant) {
    throw new Error(NOT_FOUND);
  }
};

