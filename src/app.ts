import "reflect-metadata";
import { connectDB } from "./config/database";
import cookieParser from "cookie-parser";
import router from "./router";
import express from "express";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";

dotenv.config({ path: path.join(__dirname, `../.env.${env}`) });

// Connect database
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use("/", router);

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME;

const server = app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});

//Handler unhandled promise rejections
process.on(`unhandledRejection`, (e: unknown) => {
  if (e instanceof Error) {
    console.log(`Error: ${e.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
  }
});
