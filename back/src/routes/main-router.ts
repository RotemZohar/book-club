import { Router } from "express";
import authRouter from "./auth-router";
import { authMiddleware } from "../middlewares/auth-middleware";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

// Every thing after this row needs to be authenticated
mainRouter.use(authMiddleware());

export default mainRouter;
