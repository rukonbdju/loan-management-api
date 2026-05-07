import mongoose from "mongoose";
import LoanModel from "../../models/loan";
import { LoanInput } from "./loan.types";

export const LoanService = {
    createLoan: async (loanData: LoanInput) => {
        // Auto-generate loanId
        const count = await LoanModel.countDocuments();
        const year = new Date().getFullYear();
        const sequence = (count + 1).toString().padStart(4, '0');
        const generatedId = `L-${year}-${sequence}`;
        
        const loan = new LoanModel({
            ...loanData,
            loanId: generatedId
        });
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
                    from: "contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contact"
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
                    path: "$contact",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        return loan[0];
    },

    getLoansByUser: async (userId: string, search?: string, status?: string) => {
        const _userId = new mongoose.Types.ObjectId(userId);
        const now = new Date();

        const pipeline: any[] = [
            { $match: { createdBy: _userId } },
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
                    from: "contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contact"
                }
            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    totalPaid: { $sum: "$payments.paymentAmount" },
                }
            }
        ];

        // Apply Search Filter
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { loanId: { $regex: search, $options: 'i' } },
                        { "contact.name": { $regex: search, $options: 'i' } },
                        { "contact.contactId": { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // Apply Status Filter
        if (status && status !== 'All') {
            if (status === 'Paid') {
                pipeline.push({ $match: { $expr: { $gte: ["$totalPaid", "$amount"] } } });
            } else if (status === 'Active') {
                pipeline.push({
                    $match: {
                        $and: [
                            { $expr: { $lt: ["$totalPaid", "$amount"] } },
                            { dueDate: { $gte: now } }
                        ]
                    }
                });
            } else if (status === 'Overdue') {
                pipeline.push({
                    $match: {
                        $and: [
                            { $expr: { $lt: ["$totalPaid", "$amount"] } },
                            { dueDate: { $lt: now } }
                        ]
                    }
                });
            }
        }

        pipeline.push({ $sort: { createdAt: -1 } });
        // pipeline.push({ $skip: skip });
        // pipeline.push({ $limit: limit });

        const loans = await LoanModel.aggregate(pipeline);
        return loans;
    },

    getLoanByLoanId: async (loanId: string, userId: string) => {
        return LoanModel.findOne({ loanId: loanId, createdBy: userId });
    },

    filterByContactId: async (contactId: string) => {
        const _contactId = new mongoose.Types.ObjectId(contactId);
        const loans = await LoanModel.aggregate([
            { $match: { contact: _contactId } },
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
                    from: "contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contact"
                }
            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true
                }
            },
        ])
        return loans;
    },

    updateLoan: async (id: string, updateData: Partial<LoanInput>) => {
        return LoanModel.findOneAndUpdate({ _id: id }, updateData, { new: true });
    },

    deleteLoan: async (id: string, userId: string) => {
        return LoanModel.findOneAndDelete({ _id: id });
    },

    getLoanSummary: async (createdBy: string) => {
        const userId = new mongoose.Types.ObjectId(createdBy);

        const stats = await LoanModel.aggregate([
            { $match: { createdBy: userId } },

            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "loan",
                    as: "payments",
                },
            },

            {
                $addFields: {
                    totalPaid: { $sum: "$payments.paymentAmount" },
                },
            },

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
            { $match: { createdBy: userId } },

            {
                $lookup: {
                    from: "contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            { $unwind: "$contact" },

            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "loan",
                    as: "payments",
                },
            },

            {
                $addFields: {
                    totalPaid: { $sum: "$payments.paymentAmount" },
                },
            },

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

            {
                $project: {
                    _id: 0,
                    contact: "$contact.name",
                    contactId: "$contact.contactId",
                    dueDate: 1,
                    amount: 1,
                    status: 1,
                },
            },

            { $limit: 10 },
        ]);

        return loans;
    }
};
