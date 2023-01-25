import { Request, Response, NextFunction } from "express";


export const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (authorization === process.env.APIKEY) {
      next();
    } else {
      res.status(401).json({ Error: "Unauthorized" });
    }
  }