import { Router } from "express";

import authRouter from "../modules/auth/auth.routes";
import borrowerRouter from "../modules/borrower/borrower.routes";

const router = Router()

router.use('/auth', authRouter)
router.use('/borrowers', borrowerRouter)

export default router;