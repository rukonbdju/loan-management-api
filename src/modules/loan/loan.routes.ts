import express from "express";
import {
    createLoan,
    getLoans,
    getLoanById,
    updateLoan,
    deleteLoan,
    getLoansByBorrowerId,
    getLoanSummary,
    getUpcomingPayments,
} from "../loan/loan.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


const loanRouter = express.Router();

loanRouter.use(authMiddleware);

loanRouter.post("/", createLoan);
loanRouter.get("/", getLoans);
loanRouter.get("/summary", getLoanSummary);
loanRouter.get("/upcoming-payments", getUpcomingPayments);
loanRouter.get("/borrower/:id", getLoansByBorrowerId);
loanRouter.get("/:id", getLoanById);
loanRouter.put("/:id", updateLoan);
loanRouter.delete("/:id", deleteLoan);

export default loanRouter;
