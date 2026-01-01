import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ObjectIdSchema = z.string().regex(objectIdRegex, "invalid objectID");

export const createChefSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().min(1, "Image is required"),
    description: z.string().min(1, "Description is required"),
    restaurants: z.array(ObjectIdSchema).default([]),
});

export const updateChefSchema = createChefSchema.partial();

export const chefIdParamSchema = z.object({ id: ObjectIdSchema });