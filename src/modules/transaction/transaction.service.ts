import mongoose from "mongoose";
import TransactionModel from "../../models/transaction";
import { CreateTransactionDTO, UpdateTransactionDTO } from "./transaction.types";

const TransactionService = {
    create: async (data: CreateTransactionDTO) => {
        const newTransaction = new TransactionModel(data);
        return await newTransaction.save();
    },

    update: async (id: string, data: UpdateTransactionDTO) => {
        return await TransactionModel.findByIdAndUpdate(id, data, { new: true });
    },

    delete: async (id: string) => {
        return await TransactionModel.findByIdAndDelete(id);
    },

    filterByDate: async (userId: string, date: string) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await TransactionModel.find({
            createdBy: userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ createdAt: -1 });
    },

    getSummary: async (userId: string) => {
        const result = await TransactionModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    }
                }
            }
        ]);

        if (result.length === 0) {
            return { totalIncome: 0, totalExpense: 0, balance: 0 };
        }

        const { totalIncome, totalExpense } = result[0];
        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };
    }
};

export default TransactionService;
