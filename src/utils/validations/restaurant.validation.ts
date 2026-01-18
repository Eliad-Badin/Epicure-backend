import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().min(1, "Image path is required"),
  chef: z.string().min(1, "Chef id is required"),
  dishes: z.array(z.string()).optional(),
});

export const updateRestaurantSchema = z
  .object({
    name: z.string().optional(),
    image: z.string().optional(),
    chef: z.string().optional(),
    dishes: z.array(z.string()).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.image !== undefined ||
      data.chef !== undefined ||
      data.dishes !== undefined,
    {
      message: "At least one field must be provided to update",
    }
  );

export const restaurantIdParamSchema = z.object({
  id: z.string().min(1, "Restaurant id is required"),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
