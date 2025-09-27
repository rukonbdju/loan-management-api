import express from "express";
import {
    createLoan,
    getLoans,
    getLoanById,
    updateLoan,
    deleteLoan,
} from "../loan/loan.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


const router = express.Router();

router.use(authMiddleware);

router.post("/", createLoan);
router.get("/", getLoans);
router.get("/:id", getLoanById);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
