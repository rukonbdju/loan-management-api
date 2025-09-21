import { Router } from "express";
import { borrowerController } from "./borrower.controller";

const borrowerRouter = Router();

borrowerRouter.post("/", borrowerController.create);
borrowerRouter.get("/", borrowerController.getAll);
borrowerRouter.get("/:id", borrowerController.getById);
borrowerRouter.get("/creator/:creatorId", borrowerController.getByCreator);
borrowerRouter.put("/:id", borrowerController.update);
borrowerRouter.delete("/:id", borrowerController.delete);

export default borrowerRouter;
