import LoanModel from "../../models/loan";
import { LoanInput } from "./loan.types";

export const LoanService = {
    createLoan: async (loanData: LoanInput) => {
        const loan = new LoanModel(loanData);
        const newLoan = await loan.save();
        return newLoan;
    },

    fetchLoanById: async (id: string) => {
        return LoanModel.findById(id).populate('borrower')
    },

    getLoansByUser: async (userId: string) => {
        return LoanModel.find({ createdBy: userId }).populate('borrower');
    },

    getLoanByLoanId: async (loanId: string, userId: string) => {
        return LoanModel.findOne({ loanId: loanId, createdBy: userId });
    },

    updateLoan: async (id: string, updateData: Partial<LoanInput>) => {
        return LoanModel.findOneAndUpdate({ _id: id }, updateData, { new: true });
    },

    deleteLoan: async (id: string, userId: string) => {
        return LoanModel.findOneAndDelete({ _id: id });
    },
};
