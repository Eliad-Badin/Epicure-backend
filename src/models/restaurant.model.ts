import {Schema, model, Types, Document } from "mongoose";

export interface RestaurantInterface extends Document {
    name: String;
    image: String;
    chef: Types.ObjectId;
    dishes: Types.ObjectId[];
}

const restaurantSchema = new Schema<RestaurantInterface>(
    {
        name: {type: String, required: true, trim: true},
        image: {type: String, required: true},
        chef: {
            type: Schema.Types.ObjectId,
            ref: "Chef",
            required: true
        },
        dishes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Dish"
            }
        ]
    }, 
    { timestamps: true }
);

export const Restaurant = model<RestaurantInterface>("Restaurant", restaurantSchema);