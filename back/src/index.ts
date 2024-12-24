import cors from "cors";
import "dotenv/config";
import http from "http";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { connectToDB } from "./db";
import mainRouter from "./routes/main-router";
import swaggerDefinition from "../swagger-definition.json";
import { notificateTasks } from "./services/task-notifications-service";

const IS_DEV = process.env.NODE_ENV === "development";

const main = async () => {
  await connectToDB();

  const app = express();
  const port = 4000;

  if (IS_DEV) {
    app.use(cors());
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, "public")));

  const specs = swaggerJsDoc(swaggerDefinition);
  app.use("/api-docs", serve, setup(specs));

  notificateTasks();

  app.use("/api", mainRouter);

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

main();
