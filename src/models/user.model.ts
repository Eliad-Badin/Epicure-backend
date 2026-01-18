import { Schema, model, Document } from "mongoose";

export type UserRole = "USER" | "ADMIN";

export interface UserInterface extends Document {
    mail: string;
    passwordHash: string;
    role: UserRole;
    name: string;
    surename: string;
}

const userSchema = new Schema<UserInterface>(
    {
        mail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        surename: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {timestamps: true}
);

export const User = model<UserInterface>("User", userSchema);