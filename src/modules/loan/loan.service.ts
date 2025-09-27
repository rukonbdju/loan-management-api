
import { Types } from "mongoose";
import LoanModel from "../../models/loan";

interface LoanInput {
    createdBy: Types.ObjectId;
    borrowerId: Types.ObjectId;
    totalAmount: number;
    currency: string;
    disbursementDate: Date;
    disbursementMethod: "Cash" | "Bkash" | "Bank";
    repaymentPlan: "one_time" | "installments";
    oneTimePlan?: { dueDate: Date };
    installmentPlan?: { numberOfInstallments: number; cycle: string; firstDueDate: Date };
}

export const LoanService = {
    createLoan: async (loanData: LoanInput) => {
        const loan = new LoanModel(loanData);
        return loan.save();
    },

    getLoansByUser: async (userId: string) => {
        return LoanModel.find({ createdBy: userId }).populate("borrowerId", "name");
    },

    getLoanById: async (loanId: string, userId: string) => {
        return LoanModel.findOne({ _id: loanId, createdBy: userId }).populate("borrowerId", "name");
    },

    updateLoan: async (loanId: string, userId: string, updateData: Partial<LoanInput>) => {
        return LoanModel.findOneAndUpdate({ _id: loanId, createdBy: userId }, updateData, { new: true });
    },

    deleteLoan: async (loanId: string, userId: string) => {
        return LoanModel.findOneAndDelete({ _id: loanId, createdBy: userId });
    },
};
