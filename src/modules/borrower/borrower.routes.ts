import { Router } from "express";
import { BorrowerController } from "./borrower.controller";

const borrowerRouter = Router();

borrowerRouter.post("/", BorrowerController.create);
borrowerRouter.get("/", BorrowerController.getAll);
borrowerRouter.get("/:id", BorrowerController.getById);
borrowerRouter.get("/creator/:creatorId", BorrowerController.getByCreator);
borrowerRouter.put("/:id", BorrowerController.update);
borrowerRouter.delete("/:id", BorrowerController.delete);

export default borrowerRouter;
