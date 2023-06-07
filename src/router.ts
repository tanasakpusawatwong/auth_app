import { userRouter, authRouter } from "./routes";
import express from "express";

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
