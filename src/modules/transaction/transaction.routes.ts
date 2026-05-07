import { Router } from "express";
import TransactionController from "./transaction.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const transactionRouter = Router();

transactionRouter.use(authMiddleware);

transactionRouter.post('/', TransactionController.create);
transactionRouter.get('/', TransactionController.getDaily);
transactionRouter.get('/summary', TransactionController.getSummary);
transactionRouter.put('/:id', TransactionController.update);
transactionRouter.delete('/:id', TransactionController.delete);

export default transactionRouter;
