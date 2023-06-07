import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { connection } from "../config/database";
import { UserEntity } from "../models/user.entity";

interface IJwtPayload {
  id: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
    const userRepo = connection.getRepository(UserEntity);
    const user = await userRepo.findOne({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    next();
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`Protect Route Error: ${e.message}`);
      return res.status(500).json({ message: "Internal Server" });
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role!)) {
      return res.status(403).json({
        message: `Permission denied`,
      });
    }
    next();
  };
};
