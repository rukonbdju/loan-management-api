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

    filterByBorrowerId: async (borrowerId: string) => {
        const _borrowerId = new mongoose.Types.ObjectId(borrowerId);
        const loans = await LoanModel.aggregate([
            { $match: { borrower: _borrowerId } },
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
        ])
        return loans;
        //return LoanModel.find({ borrower: borrowerId }).populate('borrower');
    },

    updateLoan: async (id: string, updateData: Partial<LoanInput>) => {
        return LoanModel.findOneAndUpdate({ _id: id }, updateData, { new: true });
    },

    deleteLoan: async (id: string, userId: string) => {
        return LoanModel.findOneAndDelete({ _id: id });
    },

    getLoanSummary: async (createdBy: string) => {
        const userId = new mongoose.Types.ObjectId(createdBy);
        console.log({ userId, createdBy })

        const stats = await LoanModel.aggregate([
            { $match: { createdBy: userId } },

            // Lookup payments for each loan
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "loan",
                    as: "payments",
                },
            },

            // Calculate totalPaid for each loan
            {
                $addFields: {
                    totalPaid: { $sum: "$payments.paymentAmount" },
                },
            },

            // Classify loans
            {
                $addFields: {
                    isActive: {
                        $and: [
                            { $lt: ["$totalPaid", "$amount"] },
                            { $gte: ["$dueDate", new Date()] },
                        ],
                    },
                    isOverdue: {
                        $and: [
                            { $lt: ["$totalPaid", "$amount"] },
                            { $lt: ["$dueDate", new Date()] },
                        ],
                    },
                },
            },

            // Group to calculate stats
            {
                $group: {
                    _id: null,
                    totalLoanAmount: { $sum: "$amount" },
                    activeLoans: {
                        $sum: { $cond: ["$isActive", 1, 0] },
                    },
                    overdueLoans: {
                        $sum: { $cond: ["$isOverdue", 1, 0] },
                    },
                    totalPaymentAmount: { $sum: "$totalPaid" },
                },
            },
        ]);

        return stats[0] || {
            totalLoanAmount: 0,
            activeLoans: 0,
            overdueLoans: 0,
            totalPaymentAmount: 0,
        };
    },
    getUpcomingPayments: async (createdBy: string) => {
        const userId = new mongoose.Types.ObjectId(createdBy)

        const loans = await LoanModel.aggregate([
            // Filter by user
            { $match: { createdBy: userId } },

            // Lookup borrower info
            {
                $lookup: {
                    from: "borrowers",
                    localField: "borrower",
                    foreignField: "_id",
                    as: "borrower",
                },
            },
            { $unwind: "$borrower" },

            // Lookup payments for each loan
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "loan",
                    as: "payments",
                },
            },

            // Calculate total paid
            {
                $addFields: {
                    totalPaid: { $sum: "$payments.paymentAmount" },
                },
            },

            // Add calculated status
            {
                $addFields: {
                    status: {
                        $switch: {
                            branches: [
                                {
                                    case: { $gte: ["$totalPaid", "$amount"] },
                                    then: "Paid",
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lt: ["$totalPaid", "$amount"] },
                                            { $gte: ["$dueDate", new Date()] },
                                            { $gt: ["$totalPaid", 0] },
                                        ],
                                    },
                                    then: "Active",
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lt: ["$totalPaid", "$amount"] },
                                            { $lt: ["$dueDate", new Date()] },
                                        ],
                                    },
                                    then: "Overdue",
                                },
                            ],
                            default: "Unpaid",
                        },
                    },
                },
            },

            // Project final output
            {
                $project: {
                    _id: 0,
                    borrower: "$borrower.name",
                    borrowerId: "$borrower.borrowerId",
                    dueDate: 1,
                    amount: 1,
                    status: 1,
                },
            },

            // Limit to 10 results
            { $limit: 10 },
        ]);

        return loans;
    }

};
