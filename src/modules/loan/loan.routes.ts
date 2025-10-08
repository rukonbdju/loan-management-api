import express from "express";
import {
    createLoan,
    getLoans,
    getLoanById,
    updateLoan,
    deleteLoan,
} from "../loan/loan.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


const loanRouter = express.Router();

loanRouter.use(authMiddleware);

loanRouter.post("/", createLoan);
loanRouter.get("/creator/:id", getLoans);
loanRouter.get("/:id", getLoanById);
loanRouter.put("/:id", updateLoan);
loanRouter.delete("/:id", deleteLoan);

export default loanRouter;
