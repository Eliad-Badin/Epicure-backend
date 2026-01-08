import { Types } from "mongoose";
import { Chef, CreateChefInput, UpdateChefInput } from "../models/chef.model";
import { INVALID_ID, NOT_FOUND } from "../constants/strings";
import { json } from "zod";

export const getAllChefs = async () => {
    return Chef.find().lean();
};

export const getChefById = async (id: string) => {
    if(!Types.ObjectId.isValid(id)) 
      throw new Error(INVALID_ID);

    const chef = await Chef.findById(id).lean();
    if(!chef)
        throw new Error(NOT_FOUND);

    return chef;
};

export const getChefOfTheWeek = async () => {
  const chefId = process.env.CHEF_OF_WEEK_ID;

  console.log('Chef of the week id raw:', JSON.stringify(chefId));

  if (!chefId) {
    throw new Error(INVALID_ID);
  }

  if (!Types.ObjectId.isValid(chefId)) {
    console.log("isValid check FAILED for:", chefId);
    throw new Error(INVALID_ID);
  }

  const chef = await Chef.findById(chefId)
    .populate({
      path: "restaurants",
      select: "name image chef",
      populate: { path: "chef", select: "name" },
    })
    .lean();

  if (!chef) {
    throw new Error(NOT_FOUND);
  }

  return chef;
};

export const createChef = async (data: CreateChefInput) => {
    const chef = await Chef.create({
        name: data.name,
        image: data.image,
        description: data.description,
        restaurants: data.restaurants.map((id) => new Types.ObjectId(id)),
    });

    return chef;
};

export const updateChef = async (id: string, data: UpdateChefInput) => {
    const update: any = { ...data };

    if (data.restaurants) {
        update.restaurants = data.restaurants.map((rid) => new Types.ObjectId(rid));
    }

    const chef = await Chef.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
    });

    return chef;
};

export const deleteChef = async (id: string) => {
    const result = await Chef.findByIdAndDelete(id);
    return result;
};