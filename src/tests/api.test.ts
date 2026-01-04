import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../app";
import { connectDB, disconnectDB } from "../utils/config/db.config";
import { Chef } from "../models/chef.model";
import { Restaurant } from "../models/restaurant.model";
import { Dish } from "../models/dish.model";

describe("Epicure API – chefs, restaurants, dishes", () => {
  let chefId: string;
  let restaurantId: string;
  let dishId: string;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    process.env.MONGO_URI = uri;

    await connectDB();
  });

  beforeEach(async () => {
    await Promise.all([
      Chef.deleteMany({}),
      Restaurant.deleteMany({}),
      Dish.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
    await mongoServer.stop();
  });

  it("should perform full CRUD for chef, restaurant and dish and maintain relations", async () => {
    const createChefRes = await request(app)
      .post("/api/chefs")
      .send({
        name: "Asaf Granit",
        image: "/images/chefs/asaf-granit.png",
        description: "Mediterranean cuisine pioneer",
        restaurants: [],
      });

    expect(createChefRes.status).toBe(201);
    expect(createChefRes.body).toHaveProperty("_id");
    chefId = createChefRes.body._id;

    const listChefsRes = await request(app).get("/api/chefs");
    expect(listChefsRes.status).toBe(200);
    expect(Array.isArray(listChefsRes.body)).toBe(true);
    expect(listChefsRes.body.length).toBe(1);

    const getChefRes = await request(app).get(`/api/chefs/${chefId}`);
    expect(getChefRes.status).toBe(200);
    expect(getChefRes.body.name).toBe("Asaf Granit");

    const updateChefRes = await request(app)
      .patch(`/api/chefs/${chefId}`)
      .send({
        name: "Asaf Granit Updated",
      });

    expect(updateChefRes.status).toBe(200);
    expect(updateChefRes.body.name).toBe("Asaf Granit Updated");

    const createRestaurantRes = await request(app)
      .post("/api/restaurants")
      .send({
        name: "Claro",
        image: "/images/restaurants/claro.jpg",
        chef: chefId,
        dishes: [],
      });

    expect(createRestaurantRes.status).toBe(201);
    expect(createRestaurantRes.body).toHaveProperty("_id");
    restaurantId = createRestaurantRes.body._id;

    const chefAfterRestaurantRes = await request(app).get(
      `/api/chefs/${chefId}`
    );
    expect(chefAfterRestaurantRes.status).toBe(200);
    expect(Array.isArray(chefAfterRestaurantRes.body.restaurants)).toBe(true);
    expect(
      chefAfterRestaurantRes.body.restaurants.map(String)
    ).toContain(restaurantId);

    const listRestaurantsRes = await request(app).get("/api/restaurants");
    expect(listRestaurantsRes.status).toBe(200);
    expect(Array.isArray(listRestaurantsRes.body)).toBe(true);
    expect(listRestaurantsRes.body.length).toBe(1);

    const getRestaurantRes = await request(app).get(
      `/api/restaurants/${restaurantId}`
    );
    expect(getRestaurantRes.status).toBe(200);
    expect(getRestaurantRes.body.name).toBe("Claro");

    // ===== DISH: CREATE (and update restaurant.dishes) =====
    const createDishRes = await request(app)
      .post("/api/dishes")
      .send({
        name: "Pad Ki Mao",
        price: 88,
        image: "/images/dishes/pad-ki-mao.jpg",
        icons: ["spicy"],
        restaurantId: restaurantId, 
        mealType: "dinner",
      });

    expect(createDishRes.status).toBe(201);
    expect(createDishRes.body).toHaveProperty("_id");
    dishId = createDishRes.body._id;


    const restaurantAfterDishRes = await request(app).get(
      `/api/restaurants/${restaurantId}`
    );
    expect(restaurantAfterDishRes.status).toBe(200);
    expect(Array.isArray(restaurantAfterDishRes.body.dishes)).toBe(true);
    expect(
      restaurantAfterDishRes.body.dishes.map(String)
    ).toContain(dishId);

    const listDishesRes = await request(app).get("/api/dishes");
    expect(listDishesRes.status).toBe(200);
    expect(Array.isArray(listDishesRes.body)).toBe(true);
    expect(listDishesRes.body.length).toBe(1);

    const getDishRes = await request(app).get(`/api/dishes/${dishId}`);
    expect(getDishRes.status).toBe(200);
    expect(getDishRes.body.name).toBe("Pad Ki Mao");

    const updateDishRes = await request(app)
      .patch(`/api/dishes/${dishId}`)
      .send({
        price: 99,
      });

    expect(updateDishRes.status).toBe(200);
    expect(updateDishRes.body.price).toBe(99);

    const deleteDishRes = await request(app).delete(`/api/dishes/${dishId}`);
    expect(deleteDishRes.status).toBe(204);

    const restaurantAfterDishDeleteRes = await request(app).get(
      `/api/restaurants/${restaurantId}`
    );
    expect(restaurantAfterDishDeleteRes.status).toBe(200);
    expect(
      restaurantAfterDishDeleteRes.body.dishes.map(String)
    ).not.toContain(dishId);

    const updateRestaurantRes = await request(app)
      .patch(`/api/restaurants/${restaurantId}`)
      .send({
        name: "Claro Updated",
      });

    expect(updateRestaurantRes.status).toBe(200);
    expect(updateRestaurantRes.body.name).toBe("Claro Updated");

// ===== RESTAURANT: DELETE =====
const deleteRestaurantRes = await request(app).delete(
  `/api/restaurants/${restaurantId}`
);
expect(deleteRestaurantRes.status).toBe(204);

// Chef.restaurants should no longer contain this restaurant
const chefAfterRestaurantDeleteRes = await request(app).get(
  `/api/chefs/${chefId}`
);
expect(chefAfterRestaurantDeleteRes.status).toBe(200);
expect(
  (chefAfterRestaurantDeleteRes.body.restaurants || []).map(String)
).not.toContain(restaurantId);

// ===== CHEF: DELETE =====
const deleteChefRes = await request(app).delete(`/api/chefs/${chefId}`);
expect(deleteChefRes.status).toBe(204);
  });
});
