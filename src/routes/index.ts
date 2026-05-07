import { Router } from "express";

import authRouter from "../modules/auth/auth.routes";
import contactRouter from "../modules/contact/contact.routes";
import loanRouter from "../modules/loan/loan.routes";
import paymentRouter from "../modules/payment/payment.routes";
import transactionRouter from "../modules/transaction/transaction.routes";
import reportRouter from "../modules/report/report.routes";

const router = Router()

router.use('/auth', authRouter)
router.use('/contacts', contactRouter)
router.use('/loans', loanRouter)
router.use('/payments', paymentRouter)
router.use('/transactions', transactionRouter)
router.use('/reports', reportRouter)

export default router;