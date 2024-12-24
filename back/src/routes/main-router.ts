import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import authRouter from "./auth-router";
import groupRouter from "./group-router";
import petRouter from "./pet-router";
import userRouter from "./user-router";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

// Every thing after this row needs to be authenticated
mainRouter.use(authMiddleware());

mainRouter.use("/pet", petRouter);
mainRouter.use("/group", groupRouter);
mainRouter.use("/user", userRouter);

export default mainRouter;
