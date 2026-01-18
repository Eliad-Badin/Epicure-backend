import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    surename: z.string().min(1, "Surename is required"),
    mail: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
    mail: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;