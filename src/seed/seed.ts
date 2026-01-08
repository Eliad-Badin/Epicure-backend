import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Chef } from "../models/chef.model";
import { Restaurant } from "../models/restaurant.model";
import { Dish } from "../models/dish.model";
import { restaurants as mockRestaurants, dishes as mockDishes, chefs as mockChefs } from "./mockData";
import { connectDB } from "../utils/config/db.config";

type RawRestaurant = {
  id: string;
  name: string;
  image: string;
  chef: string;
};

type RawDish = {
  id: string;
  restaurantId: string;
  mealType: string;
  name: string;
  image: string;
  description: string;
  price: number;
  tags: string[];
};

type RawChef = {
  id: string;
  name: string;
  image: string;
  description: string;
};

const toRawRestaurants = (items: any[]): RawRestaurant[] =>
  items.map((r) => ({
    id: r.id,
    name: r.name,
    image: r.image,
    chef: r.chef,
  }));

const toRawDishes = (items: any[]): RawDish[] =>
  items.map((d) => ({
    id: d.id,
    restaurantId: d.restaurantId,
    mealType: d.mealType,
    name: d.name,
    image: d.image,
    description: d.description,
    price: d.price,
    tags: d.tags,
  }));

const toRawChefs = (items: any[]): RawChef[] =>
  items.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    description: c.description,
  }));

async function seed() {
  await connectDB();

  await Dish.deleteMany({});
  await Restaurant.deleteMany({});
  await Chef.deleteMany({});

  const rawRestaurants = toRawRestaurants(mockRestaurants);
  const rawDishes = toRawDishes(mockDishes);
  const rawChefs = toRawChefs(mockChefs);

  const chefNameSet = new Set<string>();
  rawChefs.forEach((c) => chefNameSet.add(c.name));
  rawRestaurants.forEach((r) => chefNameSet.add(r.chef));

const chefInsertData = Array.from(chefNameSet).map((name) => {
  const existing = rawChefs.find((c) => c.name === name);

  return {
    name,
    image: existing?.image ?? "/images/chefs/placeholder.png",
    description:
      existing?.description ?? `Chef ${name} – description coming soon.`,
    restaurants: [] as mongoose.Types.ObjectId[],
  };
});

  const chefDocs = await Chef.insertMany(chefInsertData);

  const chefByName = new Map<string, mongoose.Types.ObjectId>();
  chefDocs.forEach((doc) => {
    chefByName.set(doc.name, doc._id);
  });

  const restaurantInsertData = rawRestaurants.map((r) => {
    const chefId = chefByName.get(r.chef);
    if (!chefId) {
      throw new Error(`No chef found for name "${r.chef}"`);
    }
    return {
      name: r.name,
      image: r.image,
      chef: chefId,
      dishes: [] as mongoose.Types.ObjectId[],
    };
  });

  const restaurantDocs = await Restaurant.insertMany(restaurantInsertData);

  const restaurantIdByMockId = new Map<string, mongoose.Types.ObjectId>();
  rawRestaurants.forEach((rawRest, index) => {
    const doc = restaurantDocs[index];
    if (!doc) {
      throw new Error(`Restaurant doc missing for mock id "${rawRest.id}" at index ${index}`);
    }
    restaurantIdByMockId.set(rawRest.id, doc._id);
  });

  const dishInsertData = rawDishes.map((d) => {
    const restaurantObjectId = restaurantIdByMockId.get(d.restaurantId);
    if (!restaurantObjectId) {
      throw new Error(`No restaurant found for mock id "${d.restaurantId}" used in dish "${d.id}"`);
    }

    return {
      name: d.name,
      price: d.price,
      ingredients: [d.description],
      tags: d.tags,
      restaurantId: restaurantObjectId,
      mealType: d.mealType,
      image: d.image,
    };
  });

  const dishDocs = await Dish.insertMany(dishInsertData);

  const dishesByRestaurantMockId = new Map<string, mongoose.Types.ObjectId[]>();
  rawDishes.forEach((d, index) => {
    const dishDoc = dishDocs[index];
    if (!dishDoc) {
      throw new Error(`Dish doc missing for mock id "${d.id}" at index ${index}`);
    }
    const mockRestId = d.restaurantId;
    const dishId = dishDoc._id;

    if (!dishesByRestaurantMockId.has(mockRestId)) {
      dishesByRestaurantMockId.set(mockRestId, []);
    }
    dishesByRestaurantMockId.get(mockRestId)!.push(dishId);
  });

  await Promise.all(
    restaurantDocs.map(async (rest) => {
      const entry = [...restaurantIdByMockId.entries()].find(([, value]) =>
        value.equals(rest._id)
      );
      if (!entry) return;

      const mockId = entry[0];
      const dishIds = dishesByRestaurantMockId.get(mockId) || [];
      rest.dishes = dishIds;
      await rest.save();
    })
  );

  const restaurantsByChefName = new Map<string, mongoose.Types.ObjectId[]>();
  rawRestaurants.forEach((r, index) => {
    const restDoc = restaurantDocs[index];
    if (!restDoc) {
      throw new Error(`Restaurant doc missing at index ${index} for chef mapping`);
    }
    const chefName = r.chef;
    const restId = restDoc._id;

    if (!restaurantsByChefName.has(chefName)) {
      restaurantsByChefName.set(chefName, []);
    }
    restaurantsByChefName.get(chefName)!.push(restId);
  });

  await Promise.all(
    chefDocs.map(async (chef) => {
      const restIds = restaurantsByChefName.get(chef.name) || [];
      chef.restaurants = restIds;
      await chef.save();
    })
  );

  console.log("Seeding completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
