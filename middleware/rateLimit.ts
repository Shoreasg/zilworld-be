import { rateLimit } from "express-rate-limit";

export const limitMiddleWare = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
});
