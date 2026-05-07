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

        // Loan aggregations
        const loanQuery: any = { createdBy: _userId };
        if (startDate || endDate) {
            loanQuery.disbursementDate = {};
            if (startDate) loanQuery.disbursementDate.$gte = startDate;
            if (endDate) loanQuery.disbursementDate.$lte = endDate;
        }

        const loans = await LoanModel.aggregate([
            { $match: loanQuery },
            {
                $group: {
                    _id: null,
                    totalDisbursed: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const payments = await PaymentModel.aggregate([
            { 
                $match: { 
                    paymentDate: { 
                        $gte: startDate || new Date(0), 
                        $lte: endDate || new Date() 
                    } 
                } 
            },
            {
                $lookup: {
                    from: "loans",
                    localField: "loan",
                    foreignField: "_id",
                    as: "loanData"
                }
            },
            { $unwind: "$loanData" },
            { $match: { "loanData.createdBy": _userId } },
            {
                $group: {
                    _id: null,
                    totalCollected: { $sum: "$paymentAmount" }
                }
            }
        ]);

        return {
            income,
            expense,
            netCashFlow: income - expense,
            totalDisbursed: loans[0]?.totalDisbursed || 0,
            totalCollected: payments[0]?.totalCollected || 0,
            loanCount: loans[0]?.count || 0
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
