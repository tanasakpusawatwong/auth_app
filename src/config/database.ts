import path from "path";
import { DataSource } from "typeorm";

export let connection: DataSource;

export const connectDB = () => {
  connection = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [path.join(__dirname, "../models/**/*.entity.ts")],
  });

  connection
    .initialize()
    .then(() => {
      console.log(
        `MYSQL Database is intialized at port ${Number(process.env.DB_PORT)}`
      );
    })
    .catch((e: unknown) => {
      if (e instanceof Error) {
        console.error(`Initialize Database Error: ${e.message}`);
      }
    });
};
