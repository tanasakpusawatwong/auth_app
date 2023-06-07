import express from "express";
import { signin, signup, logout } from "../controllers/auth.controller";

export const authRouter = express.Router();

// @POST    /auth/signin
// @DESC    Signin
authRouter.post("/signin", signin);

// @POST    /auth/signup
// @DESC    Signup
authRouter.post("/signup", signup);

// @GET     /auth/logout
// @DESC    Logout
authRouter.get("/logout", logout);
