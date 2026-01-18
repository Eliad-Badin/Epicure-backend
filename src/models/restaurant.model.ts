import { Schema, model, type Document, Types } from "mongoose";

export interface RestaurantInterface extends Document {
  name: string;
  image: string;
  chef: Types.ObjectId;
  dishes: Types.ObjectId[];
}

const restaurantSchema = new Schema<RestaurantInterface>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    chef: { type: Schema.Types.ObjectId, ref: "Chef", required: true },
    dishes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dish",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const Restaurant = model<RestaurantInterface>(
  "Restaurant",
  restaurantSchema
);

export default Restaurant;
