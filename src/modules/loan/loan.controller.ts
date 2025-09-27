import { Response } from "express";
import { LoanService } from "../loan/loan.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createLoan = async (req: AuthRequest, res: Response) => {
    try {
        const createdBy = req.userId;
        const loanData = { ...req.body, createdBy };
        const loan = await LoanService.createLoan(loanData);
        res.status(201).json({ success: true, loan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getLoans = async (req: AuthRequest, res: Response) => {
    try {
        const createdBy = String(req.userId);
        const loans = await LoanService.getLoansByUser(createdBy);
        res.json({ success: true, loans });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getLoanById = async (req: AuthRequest, res: Response) => {
    try {
        const createdBy = String(req.userId);
        const loan = await LoanService.getLoanById(req.params.id, createdBy);
        if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, loan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateLoan = async (req: AuthRequest, res: Response) => {
    try {
        const createdBy = String(req.userId);
        const loan = await LoanService.updateLoan(req.params.id, createdBy, req.body);
        if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, loan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteLoan = async (req: AuthRequest, res: Response) => {
    try {
        const createdBy = String(req.userId);
        const loan = await LoanService.deleteLoan(req.params.id, createdBy);
        if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });
        res.json({ success: true, message: "Loan deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
