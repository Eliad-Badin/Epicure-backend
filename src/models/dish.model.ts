import { Schema, model, Types, Document } from "mongoose";

export interface DishInterface extends Document {
    name: string;
    price: number;
    ingredients: string[];
    tags: string[];
    restaurant: Types.ObjectId;
}

const dishSchema = new Schema<DishInterface> (
    {
        name: {type: String, required: true, trim: true},
        price: {type: Number, required: true, min: 0},
        ingredients: {
            type: [String],
            default: []
        },
        tags: {
            type: [String],
            default: []
        },
        restaurant: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        }
    },
    { timestamps: true }
);

export const Dish = model<DishInterface>("Dish", dishSchema);