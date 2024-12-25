import { Router } from "express";
import bookRouter from "./book";
import clubRouter from "./club";

const mainRouter = Router();

mainRouter.use("/book", bookRouter);
mainRouter.use("/club", clubRouter);

export default mainRouter;
