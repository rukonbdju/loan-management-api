import { Router } from "express";
import { BorrowerController } from "./borrower.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const borrowerRouter = Router();
//auth middleware 
borrowerRouter.use(authMiddleware);
//routes
borrowerRouter.post("/", BorrowerController.create);
borrowerRouter.get("/", BorrowerController.getAll);
borrowerRouter.get("/:id", BorrowerController.getById);
borrowerRouter.get("/creator/:creatorId", BorrowerController.getByCreator);
borrowerRouter.put("/:id", BorrowerController.update);
borrowerRouter.delete("/:id", BorrowerController.delete);

export default borrowerRouter;
