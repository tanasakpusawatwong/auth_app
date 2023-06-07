import { authorize, protectRoute } from "../middleware/auth.middleware";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import express from "express";

export const userRouter = express.Router();

// @GET     /users
// @DESC    Get all users
userRouter.get("/", protectRoute, authorize("admin"), getUsers);

// @GET     /users/me
// @DESC    Get a user
userRouter.get("/me", protectRoute, getUser);

// @PATCH   /users
// @DESC    Update the suser
userRouter.patch("/", protectRoute, updateUser);

// @DELETE  /users/:userId
// @DESC    Delete a user
userRouter.delete("/:userId", protectRoute, authorize("admin"), deleteUser);
