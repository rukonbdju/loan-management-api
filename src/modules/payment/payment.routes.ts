import { Router } from "express";
import PaymentController from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const paymentRouter = Router();
//auth middleware 
paymentRouter.use(authMiddleware);
//api routes
paymentRouter.post('/', PaymentController.create)
paymentRouter.get('/', PaymentController.filterByUserId)
paymentRouter.put('/:id', PaymentController.update)
paymentRouter.delete('/:id', PaymentController.delete)

export default paymentRouter;