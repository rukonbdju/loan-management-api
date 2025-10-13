import { NextFunction, Response } from "express";
import { LoanService } from "../loan/loan.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { parseError } from "../../utils/parseError";

export const createLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const createdBy = req.userId;
        if (!createdBy) {
            res.status(404).json({ success: false, message: "User not fount" })
            return;
        }
        const loanId = req?.body?.loanId
        const loanData = { ...req.body, createdBy };
        const isExist = await LoanService.getLoanByLoanId(loanId, createdBy)
        if (isExist) {
            res.status(401).json({ success: false, message: "Duplicate Loan ID" })
            return;
        }
        const loan = await LoanService.createLoan(loanData);
        res.status(201).json({ success: true, data: loan });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};

export const getLoans = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const createdBy = req.userId;
        if (!createdBy) {
            res.status(404).json({ success: false, message: "User not fount" })
            return;
        }
        const loans = await LoanService.getLoansByUser(createdBy);
        res.json({ success: true, data: loans });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};

export const getLoanById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const loan = await LoanService.fetchLoanById(req.params.id);
        if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, data: loan });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};
export const getLoanSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const createdBy = req.userId;
        if (!createdBy) {
            res.status(404).json({ success: false, message: "User not fount" })
            return;
        }
        const data = await LoanService.getLoanSummary(createdBy);
        if (!data) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, data });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};

export const getUpcomingPayments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const createdBy = req.userId;
        if (!createdBy) {
            res.status(404).json({ success: false, message: "User not fount" })
            return;
        }
        const data = await LoanService.getUpcomingPayments(createdBy);
        if (!data) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, data });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};

export const getLoansByBorrowerId = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const loans = await LoanService.filterByBorrowerId(req.params.id);
        if (!loans) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, data: loans });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};

export const updateLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const loan = await LoanService.updateLoan(req.params.id, req.body);
        res.json({ success: true, data: loan });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};

export const deleteLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const createdBy = String(req.userId);
        const loan = await LoanService.deleteLoan(req.params.id, createdBy);
        if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, message: "Loan deleted" });
    } catch (error) {
        const parsedError = parseError(error)
        next(parsedError);
    }
};


