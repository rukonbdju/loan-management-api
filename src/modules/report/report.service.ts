import mongoose from "mongoose";
import LoanModel from "../../models/loan";
import TransactionModel from "../../models/transaction";
import PaymentModel from "../../models/payment";

export const ReportService = {
    getFinancialSummary: async (userId: string, startDate?: Date, endDate?: Date) => {
        const _userId = new mongoose.Types.ObjectId(userId);
        const query: any = { createdBy: _userId };
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }

        const transactions = await TransactionModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const income = transactions.find(t => t._id === 'income')?.total || 0;
        const expense = transactions.find(t => t._id === 'expense')?.total || 0;
        const donation = transactions.find(t => t._id === 'donation')?.total || 0;

        // Loan aggregations
        const loanQuery: any = { createdBy: _userId };
        // We don't filter loan stats by date for the main dashboard usually, 
        // but if dates are provided, we should respect them for "Total Lent" 
        // while "Active" and "Overdue" are current status.
        
        const loansStats = await LoanModel.aggregate([
            { $match: { createdBy: _userId } },
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
                    totalLent: { $sum: "$amount" },
                    activeLoans: { $sum: { $cond: ["$isActive", 1, 0] } },
                    overdueLoans: { $sum: { $cond: ["$isOverdue", 1, 0] } },
                    totalCollected: { $sum: "$totalPaid" },
                },
            },
        ]);

        const stats = loansStats[0] || {
            totalLent: 0,
            activeLoans: 0,
            overdueLoans: 0,
            totalCollected: 0,
        };

        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense - donation,
            totalLent: stats.totalLent,
            activeLoans: stats.activeLoans,
            overdueLoans: stats.overdueLoans,
            totalCollected: stats.totalCollected,
            totalDonation: donation
        };

    },


    getLoanStatusDistribution: async (userId: string) => {
        const _userId = new mongoose.Types.ObjectId(userId);
        const now = new Date();

        const stats = await LoanModel.aggregate([
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
                $addFields: {
                    totalPaid: { $sum: "$payments.paymentAmount" }
                }
            },
            {
                $project: {
                    status: {
                        $cond: [
                            { $gte: ["$totalPaid", "$amount"] },
                            "Paid",
                            {
                                $cond: [
                                    { $lt: ["$dueDate", now] },
                                    "Overdue",
                                    "Active"
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        return stats;
    },

    getCashFlowChartData: async (userId: string) => {
        const _userId = new mongoose.Types.ObjectId(userId);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const data = await TransactionModel.aggregate([
            { 
                $match: { 
                    createdBy: _userId,
                    date: { $gte: sixMonthsAgo }
                } 
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $group: {
                    _id: {
                        month: "$_id.month",
                        year: "$_id.year"
                    },
                    income: {
                        $sum: { $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0] }
                    },
                    expense: {
                        $sum: { $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    name: {
                        $let: {
                            vars: {
                                monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            },
                            in: { $arrayElemAt: ["$$monthsInString", "$_id.month"] }
                        }
                    },
                    income: 1,
                    expense: 1
                }
            }
        ]);

        return data;
    }
};
