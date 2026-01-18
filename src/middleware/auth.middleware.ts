import {Request, Response, NextFunction} from "express";
import { verifyAuthToken, JwtPayload } from "../utils/auth/auth.utils";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Invalid Authorization header format" });
    }

    const payload = verifyAuthToken(token);

    if (!payload) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = payload;
    next();
}


export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user)
        return res.status(401).json({error: "User not authenticated"});
    if (req.user.role !== "ADMIN")
        return res.status(403).json({error: "Admin access required"});
    next();
}