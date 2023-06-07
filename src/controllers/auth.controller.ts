import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { connection } from "../config/database";
import { UserEntity } from "../models/user.entity";
import { ValidationError } from "class-validator";

const sendJwtToken = (user: UserEntity, res: Response) => {
  const token = user.getSignedJwtToken();
  return res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      token,
    });
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepo = connection.getRepository(UserEntity);
    const user = await userRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const matchPwd = await bcrypt.compare(password, user.password);
    if (!matchPwd) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    sendJwtToken(user, res);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`Signin error: ${e.message}`);
      return res.status(500).json({ message: "Internal Server" });
    }
  }
};

export const signup = async (req: Request, res: Response) => {
  const userRepo = connection.getRepository(UserEntity);
  const { email, password, username } = req.body;
  try {
    const user = userRepo.create({
      email,
      password,
      username,
    });
    await user.validator();
    const data = await userRepo.save(user);
    return res.status(200).json({ user: data });
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      console.log(`Validation failed: ${e.toString()}`);
      return res.status(500).json({ message: { ...e.constraints } });
    } else if (e instanceof Error) {
      console.log(`Signup error: ${e.message}`);
      return res.status(500).json({ message: e.message });
    }
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
};
