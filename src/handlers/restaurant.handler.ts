import { Types } from "mongoose";
import { Restaurant, type RestaurantInterface } from "../models/restaurant.model";
import { Chef } from "../models/chef.model";
import { Dish } from "../models/dish.model";
import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../utils/validations/restaurant.validation";
import { INVALID_ID, NOT_FOUND } from "../constants/strings";



export const createRestaurant = async (
  data: CreateRestaurantInput
): Promise<RestaurantInterface> => {
    const chefObjectId = new Types.ObjectId(data.chef);
    const payload: Partial<RestaurantInterface> = {
        name: data.name,
        image: data.image,
        chef: chefObjectId,
        ...(data.dishes && {
        dishes: data.dishes.map((id) => new Types.ObjectId(id)),
        }),
    };

  const restaurant = await Restaurant.create(payload);

  await Chef.findByIdAndUpdate(chefObjectId, {
    $addToSet: { restaurants: restaurant._id},
  });

  return restaurant;
};

export const getRestaurants = async (): Promise<RestaurantInterface[]> => {
  return Restaurant.find().populate("chef", "name").lean();
};

export const getRestaurantById = async (
  id: string
): Promise<RestaurantInterface | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const restaurant = await Restaurant.findById(id).populate("chef", "name").populate(({path: "dishes"})).lean();
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

export const deleteRestaurant = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(INVALID_ID);
  }

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return false;
  }

  const restaurantId = restaurant._id;
  const chefRef = restaurant.chef;
  const dishIds = restaurant.dishes ?? [];

  await Restaurant.deleteOne({ _id: restaurantId });

  if (chefRef) {
    await Chef.updateOne(
      { _id: chefRef },
      { $pull: { restaurants: restaurantId } }
    );
  }

  if (dishIds.length > 0) {
    await Dish.deleteMany({ _id: { $in: dishIds } });
  }

  return true;
};

