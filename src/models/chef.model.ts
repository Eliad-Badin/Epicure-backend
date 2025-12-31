import { Schema, model, Types, Document } from "mongoose";

export interface ChefInterface extends Document {
    name: string;
    image: string;
    description: string;
    restaurants: Types.ObjectId[];
}

const chefSchema = new Schema<ChefInterface> ({
    name: {type: String, required: true, trim: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    restaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ]
},
{ timestamps: true }
);

export const Chef = model<ChefInterface>("Chef", chefSchema);