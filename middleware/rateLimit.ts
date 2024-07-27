import { rateLimit } from 'express-rate-limit';
import { Request, Response, NextFunction } from "express";




export const limitMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 5, // Limit each IP to 5 requests per windowMs
    })
    next();
}