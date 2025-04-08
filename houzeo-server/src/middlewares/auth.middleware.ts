// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const publicRoutes = ["/api/form/auth"];

  if (publicRoutes.includes(req.path)) {
    return next();
  }
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
