import { Router } from "express";
import { ContactController } from "./contact.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const contactRouter = Router();

// auth middleware 
contactRouter.use(authMiddleware);

// routes
contactRouter.post("/", ContactController.create);
contactRouter.get("/", ContactController.getAll);
contactRouter.get("/:id", ContactController.getById);
contactRouter.get("/creator/:creatorId", ContactController.getByCreator);
contactRouter.put("/:id", ContactController.update);
contactRouter.delete("/:id", ContactController.delete);

export default contactRouter;
