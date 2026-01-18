import { z } from "zod";
import type { MealType } from "../../models/dish.model";

export const mealTypeEnum = z.enum(["breakfast", "lunch", "dinner", "all"]);

export const createDishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().min(1, "Image path is required"),
  price: z.number().min(0, "Price must be >= 0"),
  restaurantId: z.string().min(1, "Restaurant id is required"),
  mealType: mealTypeEnum,
  icons: z.array(z.string()).optional(),
});

export const updateDishSchema = createDishSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const dishIdParamSchema = z.object({
  id: z.string().min(1, "Dish id is required"),
});

export type CreateDishInput = z.infer<typeof createDishSchema>;
export type UpdateDishInput = z.infer<typeof updateDishSchema>;
export type DishIdParams = z.infer<typeof dishIdParamSchema>;
export type MealTypeInput = MealType;
