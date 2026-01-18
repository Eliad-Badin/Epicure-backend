import { Schema, model, Types, Document } from "mongoose";

export type MealType = "breakfast" | "lunch" | "dinner" | "all";

export interface DishInterface extends Document {
    name: string;
    price: number;
    ingredients: string[];
    tags: string[];
    restaurantId: Types.ObjectId;
    mealType: MealType;
    image: string;
}

const dishSchema = new Schema<DishInterface> (
    {
        name: {type: String, required: true, trim: true},
        price: {type: Number, required: true, min: 0},
        image: {type: String, required: true, trim: true},
        ingredients: {
            type: [String],
            default: []
        },
        tags: {
            type: [String],
            default: []
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        mealType: {
            type: String,
            enum: ["breakfast", "lunch", "dinner", "all"],
            default: "all",
        },
    },
    { timestamps: true }
);

export const Dish = model<DishInterface>("Dish", dishSchema);