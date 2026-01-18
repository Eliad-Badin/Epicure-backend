import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
    getAllChefs,
    getChefById,
    createChef,
    updateChef,
    deleteChef,
    getChefOfTheWeek, 
    setChefOfTheWeek
} from "../handlers/chef.handler";
import {
    createChefSchema,
    updateChefSchema,
    chefIdParamSchema
} from "../utils/validations/chef.validation";


export const createChefController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
try {
  const data = createChefSchema.parse(req.body);
  const chef = await createChef(data);

  res.status(201).json(chef);
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

    next(error);
}
};

export const getChefsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const chefs = await getAllChefs();
        res.status(200).json(chefs);
    } catch (err) {
        next(err);
    }
};

export const getChefByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const params = chefIdParamSchema.parse(req.params);
        const chef = await getChefById(params.id);

        if (!chef)
            return res.status(400).json({ message: "Chef not found" });

        res.status(200).json(chef);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
            errors: err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
      })),
    });
  }

    next(err);
    }
}

export async function getChefOfTheWeekController(
    _req: Request,
    res: Response) {
    try {
        const chef = await getChefOfTheWeek();
        res.status(200).json(chef);
    } catch (err: any) {
        res.status(404).json({ message: err.message });
    }
}

export async function setChefOfTheWeekController(req: Request<{chefId: string}>, res: Response) {
    try {
        const chefId  = req.params.chefId;

        if(!chefId) {
            return res.status(400).json({ message: "Chef ID is required" });
        }

        const chef = await setChefOfTheWeek(chefId);

        res.status(200).json(chef);

    } catch (err: any) {
        res.status(404).json({ message: err.message || "Failed to set Chef of the Week" });
    }
};

export const updateChefController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = chefIdParamSchema.parse(req.params);
    const body = updateChefSchema.parse(req.body);

    const chef = await updateChef(params.id, body);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    return res.status(200).json(chef);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    next(error);
  }
};

export const deleteChefController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = chefIdParamSchema.parse(req.params);

    const deleted = await deleteChef(params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.status(204).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        errors: err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    next(err);
  }
};