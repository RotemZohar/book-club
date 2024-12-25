import { Router } from "express";
import authRouter from "./auth-router";
import { authMiddleware } from "../middlewares/auth-middleware";
import bookRouter from "./book";
import clubRouter from "./club";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

// Every thing after this row needs to be authenticated
mainRouter.use(authMiddleware());

mainRouter.use("/book", bookRouter);
mainRouter.use("/club", clubRouter);

export default mainRouter;
