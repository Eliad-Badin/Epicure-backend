import { Schema, model, Types, Document } from "mongoose";

export interface ChefInterface extends Document {
    name: string;
    image: string;
    description: string;
    restaurants: Types.ObjectId[];
    isChefOfTheWeek?: boolean;
}

export interface CreateChefInput {
    name: string;
    image: string;
    description: string;
    restaurants: string[];
}

export interface UpdateChefInput {
    name?: string | undefined;
    image?: string | undefined;
    description?: string | undefined;
    restaurants?: string[] | undefined;
    isChefOfTheWeek?: boolean | undefined;
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
    ],
    isChefOfTheWeek: { type: Boolean, default: false }
},
{ timestamps: true }
);

export const Chef = model<ChefInterface>("Chef", chefSchema);