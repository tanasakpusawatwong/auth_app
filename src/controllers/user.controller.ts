import { connection } from "../config/database";
import { Request, Response } from "express";
import { UserEntity } from "../models/user.entity";

export const getUsers = async (req: Request, res: Response) => {
  const userRepo = connection.getRepository(UserEntity);
  const users = await userRepo.find();
  return res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const userRepo = connection.getRepository(UserEntity);
  const user = await userRepo.findOne({
    where: { id: req.user!.id },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const userRepo = connection.getRepository(UserEntity);
  const user = await userRepo.findOne({ where: { id: req.user?.id } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const saveUser = userRepo.create({
    ...user,
    ...req.body,
  });
  const newUser = await userRepo.save(saveUser);
  return res.status(200).json(newUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userRepo = connection.getRepository(UserEntity);
  const result = await userRepo.delete({ id: userId });
  res.status(200).json(result);
};
