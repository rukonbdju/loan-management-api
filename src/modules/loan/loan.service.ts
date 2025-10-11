import mongoose from "mongoose";
import LoanModel from "../../models/loan";
import { LoanInput } from "./loan.types";

export const LoanService = {
    createLoan: async (loanData: LoanInput) => {
        const loan = new LoanModel(loanData);
        const newLoan = await loan.save();
        return newLoan;
    },

    fetchLoanById: async (id: string) => {
        const _id = new mongoose.Types.ObjectId(id);

        const loan = await LoanModel.aggregate([
            {
                $match: { _id: _id }
            },
            {
                $lookup: {
                    from: "borrowers",
                    localField: "borrower",
                    foreignField: "_id",
                    as: "borrower"
                }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "loan",
                    as: "payments"
                }
            },
            {
                $unwind: {
                    path: "$borrower",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        return loan[0];
    },

    getLoansByUser: async (userId: string) => {
        const _userId = new mongoose.Types.ObjectId(userId);

        const page = 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const loans = await LoanModel.aggregate([
            { $match: { createdBy: _userId } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "loan",
                    as: "payments"
                }
            },
            {
                $lookup: {
                    from: "borrowers",
                    localField: "borrower",
                    foreignField: "_id",
                    as: "borrower"
                }
            },
            {
                $unwind: {
                    path: "$borrower",
                    preserveNullAndEmptyArrays: true
                }
            },

            { $skip: skip },
            { $limit: limit }
        ])
        return loans;

        //return LoanModel.find({ createdBy: userId }).populate('borrower');
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
