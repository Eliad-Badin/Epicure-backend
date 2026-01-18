import  { Request, Response } from "express";
import { registerUser, loginUser } from "../handlers/auth.handler";
import { signAuthToken } from "../utils/auth/auth.utils";
import { registerUserSchema, loginUserSchema } from "../utils/validations/auth.validation";
import { z } from "zod";

export async function registerUserController(req: Request, res: Response) {
    try {
        const parseResult = registerUserSchema.safeParse(req.body);

        if (!parseResult.success) {
            const errors = z.treeifyError(parseResult.error);
            return res.status(400).json({ message: "validation error", errors });
        }

        const user = await registerUser(parseResult.data);

        res.status(201).json({
            id: user._id,
            name: user.name,
            surename: user.surename,
            mail: user.mail,
            role: user.role,
        });
    } catch (err) {
        console.error("registerUserController error:", err);
        if(err instanceof Error)
            res.status(500).json({error: err.message});
        res.status(500).json({error: "Internal server error"});
    }
}

export async function loginUserController(req: Request, res: Response) {
    try {
        const parseResult = loginUserSchema.safeParse(req.body);


        if (!parseResult.success) {
            const errors = z.treeifyError(parseResult.error);
            return res.status(400).json({message: "Validation error", errors });
        }

        const user = await loginUser(parseResult.data);
        const token = signAuthToken(user);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                surename: user.surename,
                mail: user.mail,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("loginUserController error:", err);
        if(err instanceof Error)
            return res.status(400).json({error: err.message});
        res.status(500).json({error: "Internal server error", err});
    }
}