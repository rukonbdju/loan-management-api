import { Router } from "express";

import authRouter from "../modules/auth/auth.routes";
import borrowerRouter from "../modules/borrower/borrower.routes";
import loanRouter from "../modules/loan/loan.routes";

const router = Router()

router.use('/auth', authRouter)
router.use('/borrowers', borrowerRouter)
router.use('/loans', loanRouter)

export default router;